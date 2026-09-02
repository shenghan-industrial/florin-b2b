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

export function getKV(): KVNamespaceLike | null {
  try {
    if (globalThis.KV_STORE) return globalThis.KV_STORE;
  } catch {
    /* ignore */
  }
  if (isDev()) {
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
export async function kvSeedIfEmpty<T>(key: string, seed: T): Promise<T> {
  const existing = await kvGetJSON<T>(key);
  if (existing) return existing;
  await kvPutJSON(key, seed);
  return seed;
}
