"use client";

import { useEffect, useState } from "react";
import { useT } from "@/lib/LanguageContext";
import { toast } from "./Toast";

// 首页入口弹窗：1.2s 后弹出，sessionStorage 关闭后不再弹
export default function EntryPopup() {
  const { t } = useT();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("florin_popup_closed")) return;
    const timer = setTimeout(() => setOpen(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  function close() {
    setOpen(false);
    try {
      sessionStorage.setItem("florin_popup_closed", "1");
    } catch {}
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "catalog", email, name: "" }),
      });
      toast(t("popup.ok"));
    } catch {
      toast(t("popup.ok"));
    }
    close();
  }

  if (!open) return null;

  return (
    <div className="entry-popup" id="entryPopup" style={{ display: "flex" }}>
      <div className="entry-popup__mask" onClick={close} />
      <div className="entry-popup__box">
        <button className="close" aria-label="Close" onClick={close}>×</button>
        <div className="eyebrow">{t("popup.eyebrow")}</div>
        <h3>{t("popup.title")}</h3>
        <p>{t("popup.text")}</p>
        <form onSubmit={onSubmit}>
          <input
            type="email"
            name="email"
            placeholder={t("popup.placeholder")}
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="btn btn--gold btn--block" type="submit">{t("popup.submit")}</button>
          <button className="btn btn--line btn--block" type="button" onClick={close}>{t("popup.no")}</button>
        </form>
        <div className="mini">{t("popup.mini")}</div>
      </div>
    </div>
  );
}
