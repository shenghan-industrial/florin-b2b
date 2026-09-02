// 开发启动器：同时启动 KV 桥接服务 + next dev
// 注意：直接 node 起 next CLI（不经 cmd.exe/npx），沙箱环境下也能跑
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const nextBin = path.join(root, "node_modules", "next", "dist", "bin", "next");

const kv = spawn(process.execPath, [path.join(root, "scripts", "kv-dev-server.mjs")], { stdio: "inherit", cwd: root });
const next = spawn(process.execPath, [nextBin, "dev"], { stdio: "inherit", cwd: root });

function shutdown() {
  kv.kill();
  next.kill();
  process.exit(0);
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
kv.on("exit", (code) => {
  if (code !== 0 && code !== null) {
    console.error("[dev] KV 桥接服务退出");
    shutdown();
  }
});
next.on("exit", (code) => {
  if (code !== 0 && code !== null) {
    console.error("[dev] next dev 退出");
    shutdown();
  }
});
