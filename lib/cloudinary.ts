// Cloudinary 签名上传（folder=florin，凭证走 env，参考 Shenghan 的免信用卡方案）
// dev 无凭证时返回 null，由上传路由走本地 public/uploads 兜底

export interface CloudinaryResult {
  url: string;
  original: string;
  thumbnail: string;
  medium: string;
  large: string;
}

function sha1hex(str: string): Promise<string> {
  return crypto.subtle
    .digest("SHA-1", new TextEncoder().encode(str))
    .then((buf) => Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join(""));
}

function hasCreds(): boolean {
  return !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
}

export async function uploadToCloudinary(
  file: File,
  folder = "florin"
): Promise<CloudinaryResult | null> {
  if (!hasCreds()) return null;

  const cloud = process.env.CLOUDINARY_CLOUD_NAME!;
  const key = process.env.CLOUDINARY_API_KEY!;
  const secret = process.env.CLOUDINARY_API_SECRET!;
  const ts = Math.floor(Date.now() / 1000);
  const signature = await sha1hex(`folder=${folder}&timestamp=${ts}${secret}`);

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", key);
  form.append("timestamp", String(ts));
  form.append("signature", signature);
  form.append("folder", folder);

  const r = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
    method: "POST",
    body: form,
  });
  if (!r.ok) {
    console.warn("[cloudinary] upload failed:", r.status);
    return null;
  }
  const j = await r.json();
  if (!j.secure_url) return null;
  const base = j.secure_url as string;
  const variant = (w: number) =>
    base.replace("/upload/", `/upload/c_scale,w_${w},f_webp/`);
  return {
    url: j.secure_url,
    original: j.secure_url,
    thumbnail: variant(150),
    medium: variant(600),
    large: variant(1200),
  };
}
