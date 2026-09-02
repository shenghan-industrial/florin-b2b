// 图片校验 + 哈希（Web Crypto，Edge 兼容）
const MAX_UPLOAD_SIZE = Number(process.env.MAX_UPLOAD_SIZE) || 20 * 1024 * 1024; // 20MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/svg+xml"];

export function validateImage(file: File): { ok: boolean; error?: string } {
  if (!ALLOWED.includes(file.type)) {
    return { ok: false, error: `不支持的格式 ${file.type}，仅支持 jpeg/png/webp/avif/svg` };
  }
  if (file.size > MAX_UPLOAD_SIZE) {
    return { ok: false, error: `文件超过 ${Math.round(MAX_UPLOAD_SIZE / 1024 / 1024)}MB 上限` };
  }
  return { ok: true };
}

export async function computeHash(bytes: Uint8Array<ArrayBuffer>): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", bytes);
  const hex = Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
  return hex.slice(0, 16); // 截断 16 位足够去重
}

export function extForMime(mime: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/avif": "avif",
    "image/svg+xml": "svg",
  };
  return map[mime] || "bin";
}

// 本地兜底保存（仅 nodejs 运行时可用）
export async function saveLocal(bytes: Uint8Array, ext: string): Promise<string | null> {
  try {
    const req = eval("require") as typeof require;
    const fs = req("fs") as typeof import("fs");
    const path = req("path") as typeof import("path");
    const dir = path.join(process.cwd(), "public", "uploads", "products");
    fs.mkdirSync(dir, { recursive: true });
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    fs.writeFileSync(path.join(dir, name), bytes);
    return `/uploads/products/${name}`;
  } catch {
    return null;
  }
}
