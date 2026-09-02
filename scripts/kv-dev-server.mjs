// 本地开发 KV 桥接服务器：GET/PUT /{key} ↔ .data/{key}.json
// dev 模式下 edge 沙箱无 fs，通过 fetch 访问此服务完成持久化
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const PORT = 8787;
const DIR = path.join(process.cwd(), ".data");
fs.mkdirSync(DIR, { recursive: true });

function file(key) {
  // 只允许字母数字和连字符，防目录穿越
  if (!/^[a-zA-Z0-9_-]+$/.test(key)) throw new Error("bad key");
  return path.join(DIR, `${key}.json`);
}

const server = http.createServer((req, res) => {
  const key = decodeURIComponent(req.url.split("?")[0].slice(1));
  try {
    if (req.method === "GET") {
      const p = file(key);
      if (!fs.existsSync(p)) {
        res.writeHead(404).end("not found");
        return;
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(fs.readFileSync(p, "utf8"));
    } else if (req.method === "PUT") {
      // 注意：必须按 Buffer 收集再整体解码——逐块 toString() 会把跨块的多字节 UTF-8 字符变成乱码
      const chunks = [];
      req.on("data", (c) => chunks.push(c));
      req.on("end", () => {
        const body = Buffer.concat(chunks).toString("utf8");
        fs.writeFileSync(file(key), body, "utf8");
        res.writeHead(200).end("ok");
      });
    } else {
      res.writeHead(405).end();
    }
  } catch {
    res.writeHead(400).end("bad request");
  }
});

server.listen(PORT, () => console.log(`[kv-dev] 本地 KV 桥接服务运行在 http://localhost:${PORT}`));
