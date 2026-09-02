"use client";

import { useState } from "react";
import { useT } from "@/lib/LanguageContext";
import { toast } from "./Toast";

// 订阅区块：深色背景，标题居左 + 横向邮箱表单（参照参考站样式）
export default function NewsletterForm() {
  const { t } = useT();
  const [email, setEmail] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) {
      toast(t("form.invalid"));
      return;
    }
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "newsletter", email, name: "" }),
      });
      toast(t("newsletter.ok"));
      setEmail("");
    } catch {
      toast(t("newsletter.ok"));
      setEmail("");
    }
  }

  return (
    <section className="newsletter-dark">
      <div className="container">
        <h2>{t("home.m17title")}</h2>
        <p>{t("home.m17text")}</p>
        <form className="newsletter-dark__form" onSubmit={onSubmit}>
          <input
            type="email"
            name="email"
            placeholder={t("newsletter.placeholder")}
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit">{t("home.m17button")}</button>
        </form>
        <div className="newsletter-dark__note">{t("home.m17note")}</div>
      </div>
    </section>
  );
}
