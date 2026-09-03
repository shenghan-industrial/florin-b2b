// KV ↔ 本地 .data/*.json 兜底存储（参考 Shenghan 的 lazy-require 模式，Edge 兼容）

type KVNamespaceLike = {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
};

declare global {
  // Cloudflare Pages/Workers 绑定
  // eslint-disable-next-line no-var
  var KV_STORE: KVNamespaceLike | undefined;
}

let fsMod: typeof import("fs") | null = null;
let pathMod: typeof import("path") | null = null;

// 生产环境可能使用的 KV binding 名称（按优先级尝试）
const BINDING_NAMES = ["KV_STORE", "KV", "FLORIN_KV"] as const;

function isKVLike(v: unknown): v is KVNamespaceLike {
  return (
    !!v &&
    typeof v === "object" &&
    typeof (v as KVNamespaceLike).get === "function" &&
    typeof (v as KVNamespaceLike).put === "function"
  );
}

// 从某个 env 容器中按顺序查找可用的 KV 绑定
function readBinding(store: unknown): KVNamespaceLike | null {
  if (!store || typeof store !== "object") return null;
  for (const name of BINDING_NAMES) {
    try {
      const v = (store as Record<string, unknown>)[name];
      if (isKVLike(v)) return v;
    } catch {
      /* 容器访问抛错（如 Proxy store 为 null）则继续 */
    }
  }
  return null;
}

function getFs() {
  if (fsMod === null) {
    try {
      // eval("require") 规避 webpack 在 Edge 构建时解析 Node 内置模块（Shenghan 同款技巧）
      const req = eval("require") as typeof require;
      fsMod = req("fs");
    } catch {
      fsMod = null;
    }
  }
  return fsMod;
}

function getPath() {
  if (pathMod === null) {
    try {
      const req = eval("require") as typeof require;
      pathMod = req("path");
    } catch {
      pathMod = null;
    }
  }
  return pathMod;
}

// dev 模式：edge 沙箱无 fs，通过本地 KV 桥接服务（scripts/kv-dev-server.mjs）读写 .data
const DEV_KV_URL = "http://localhost:8787";

function isDev(): boolean {
  try {
    return process.env.NODE_ENV === "development";
  } catch {
    return false;
  }
}

// 记录实际命中的绑定来源，便于线上排障（仅诊断用）
let kvSource = "none";
export function getKVSource(): string {
  return kvSource;
}

export function getKV(): KVNamespaceLike | null {
  // 1) Workers 全局注入（本地 wrangler / 部分运行时会把 binding 挂到 globalThis）
  try {
    const hit = readBinding(globalThis);
    if (hit) {
      kvSource = "globalThis";
      return hit;
    }
  } catch {
    /* ignore */
  }

  // 2) next-on-pages：绑定被注入到 process.env（其 env 是一个 AsyncLocalStorage Proxy，
  //    仅在请求上下文内可读；不在请求内访问会抛错，故必须 try/catch）
  try {
    const proc = (globalThis as { process?: { env?: unknown } }).process;
    const hit = readBinding(proc?.env);
    if (hit) {
      kvSource = "process.env";
      return hit;
    }
  } catch {
    /* ignore */
  }

  // 3) next-on-pages 请求上下文 __cloudflare-request-context__.env
  try {
    const ctx = (globalThis as Record<symbol, unknown>)[
      Symbol.for("__cloudflare-request-context__")
    ];
    const hit = readBinding((ctx as { env?: unknown } | undefined)?.env) || readBinding(ctx);
    if (hit) {
      kvSource = "request-context";
      return hit;
    }
  } catch {
    /* ignore */
  }

  if (isDev()) {
    kvSource = "dev-bridge";
    // fetch 桥接适配器（edge 沙箱可用）
    return {
      get: async (key: string) => {
        try {
          const r = await fetch(`${DEV_KV_URL}/${encodeURIComponent(key)}`);
          if (r.status === 404) return null;
          return await r.text();
        } catch {
          return null;
        }
      },
      put: async (key: string, value: string) => {
        try {
          await fetch(`${DEV_KV_URL}/${encodeURIComponent(key)}`, { method: "PUT", body: value });
        } catch {
          /* bridge 未启动时静默失败 */
        }
      },
    };
  }
  kvSource = "fs-fallback";
  return null;
}

function dataPath(key: string): string {
  const path = getPath();
  if (!path) throw new Error("no fs/path in this runtime");
  return path.join(process.cwd(), ".data", `${key}.json`);
}

export async function kvGetRaw(key: string): Promise<string | null> {
  const kv = getKV();
  if (kv) return kv.get(key);
  const fs = getFs();
  if (!fs) return null;
  const p = dataPath(key);
  if (!fs.existsSync(p)) return null;
  return fs.readFileSync(p, "utf8");
}

export async function kvPutRaw(key: string, value: string): Promise<void> {
  const kv = getKV();
  if (kv) {
    await kv.put(key, value);
    return;
  }
  const fs = getFs();
  if (!fs) return;
  const path = getPath()!;
  const p = dataPath(key);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, value, "utf8");
}

export async function kvGetJSON<T>(key: string, fallback?: T): Promise<T | null> {
  const raw = await kvGetRaw(key);
  if (!raw) return fallback ?? null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback ?? null;
  }
}

export async function kvPutJSON<T>(key: string, value: T): Promise<void> {
  await kvPutRaw(key, JSON.stringify(value));
}

// 首次读取时为空 → 写入种子数据（用于 products/blog/site-content 初始化）
// 注意：仅当 KV 真正可用时才写种子，避免绑定缺失时用旧种子静默覆盖线上数据
export async function kvSeedIfEmpty<T>(key: string, seed: T): Promise<T> {
  const existing = await kvGetJSON<T>(key);
  if (existing) return existing;
  if (getKV()) await kvPutJSON(key, seed);
  return seed;
}
