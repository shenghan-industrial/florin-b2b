"use client";

// 全局 toast 提示（静态站 main.js 的等价实现）
let timer: ReturnType<typeof setTimeout> | null = null;

export function toast(msg: string) {
  if (typeof document === "undefined") return;
  let el = document.getElementById("toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "toast";
    el.className = "toast";
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add("show");
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => el!.classList.remove("show"), 2600);
}

export default function ToastHost() {
  return <div className="toast" id="toast" />;
}
