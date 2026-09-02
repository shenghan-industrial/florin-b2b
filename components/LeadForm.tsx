"use client";

import { useState } from "react";
import { useT, useLang } from "@/lib/LanguageContext";
import { toast } from "./Toast";

// 统一线索表单：提交到 /api/lead（询盘/拿样/视频选品/目录/订阅）
export default function LeadForm({
  type,
  submitLabel,
  note,
  product,
  quantity,
  singleEmail = false,
}: {
  type: "inquiry" | "sample" | "live-selection" | "catalog";
  submitLabel?: string;
  note?: string;
  product?: string;
  quantity?: string;
  singleEmail?: boolean;
}) {
  const { t } = useT();
  const lang = useLang();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    company: "",
    person: "",
    whatsapp: "",
    email: "",
    country: "",
    qty: quantity || "",
    message: product
      ? lang === "zh"
        ? `我对 ${product} 感兴趣，请提供批发报价与交期。`
        : `Interested in ${product}. Please share wholesale quote & lead-time.`
      : "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (singleEmail) {
      if (!form.email) {
        toast(t("form.invalid"));
        return;
      }
    } else {
      if (!form.company || !form.whatsapp || !form.email) {
        toast(t("form.invalid"));
        return;
      }
    }
    setBusy(true);
    try {
      const r = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          company: form.company,
          name: form.person,
          whatsapp: form.whatsapp,
          email: form.email,
          country: form.country,
          quantity: form.qty,
          message: form.message,
          product,
        }),
      });
      if (!r.ok) {
        toast(t("form.invalid"));
        return;
      }
      toast(t("form.b2bOk"));
      setForm((f) => ({ ...f, company: "", person: "", whatsapp: "", email: "", country: "", qty: "", message: "" }));
    } catch {
      toast(t("form.b2bOk"));
    } finally {
      setBusy(false);
    }
  }

  const input = (extra: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
      style={{
        border: "1px solid var(--line-strong)",
        borderRadius: "var(--radius-sm)",
        padding: "11px 13px",
        fontSize: 14,
        background: "var(--bg)",
        color: "var(--ink)",
        width: "100%",
        minWidth: 0,
      }}
      {...extra}
    />
  );

  return (
    <form className="b2b-form" onSubmit={onSubmit} noValidate>
      {singleEmail ? (
        <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 600, color: "var(--ink-soft)" }}>
          {t("form.email")}
          {input({ type: "email", name: "email", required: true, value: form.email, onChange: set("email"), placeholder: "sales@yourcompany.com" })}
        </label>
      ) : (
        <div className="form-grid">
          <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 600, color: "var(--ink-soft)", minWidth: 0 }}>
            {t("form.company")}
            {input({ type: "text", name: "company", required: true, value: form.company, onChange: set("company") })}
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 600, color: "var(--ink-soft)", minWidth: 0 }}>
            {t("form.person")}
            {input({ type: "text", name: "person", value: form.person, onChange: set("person") })}
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 600, color: "var(--ink-soft)", minWidth: 0 }}>
            {t("form.whatsapp")}
            {input({ type: "tel", name: "whatsapp", required: true, value: form.whatsapp, onChange: set("whatsapp") })}
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 600, color: "var(--ink-soft)", minWidth: 0 }}>
            {t("form.email")}
            {input({ type: "email", name: "email", required: true, value: form.email, onChange: set("email") })}
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 600, color: "var(--ink-soft)", minWidth: 0 }}>
            {t("form.country")}
            {input({ type: "text", name: "country", value: form.country, onChange: set("country") })}
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 600, color: "var(--ink-soft)", minWidth: 0 }}>
            {t("form.qty")}
            {input({ type: "text", name: "qty", value: form.qty, onChange: set("qty") })}
          </label>
        </div>
      )}
      {!singleEmail && (
        <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 600, color: "var(--ink-soft)" }}>
          {t("form.message")}
          <textarea
            name="message"
            rows={4}
            value={form.message}
            onChange={set("message")}
            style={{
              border: "1px solid var(--line-strong)",
              borderRadius: "var(--radius-sm)",
              padding: "11px 13px",
              fontSize: 14,
              background: "var(--bg)",
              color: "var(--ink)",
              width: "100%",
              minWidth: 0,
              fontFamily: "inherit",
            }}
          />
        </label>
      )}
      <button className="btn btn--gold btn--block" type="submit" disabled={busy}>
        {submitLabel || t("form.submit")}
      </button>
      {note && <div className="newsletter__note" style={{ textAlign: "center" }}>{note}</div>}
    </form>
  );
}
