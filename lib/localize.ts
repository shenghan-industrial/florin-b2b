import type { MultiLangText } from "./types";

export type Lang = "en" | "zh";

// 双语取值：当前语言 → en 兜底 → 空串
export function pickLang(v: MultiLangText | undefined, lang: Lang): string {
  if (!v) return "";
  return v[lang] || v.en || "";
}

export function pickLangArr<T extends { en: unknown; zh: unknown }>(
  v: T | undefined,
  lang: Lang
): T["en"] {
  if (!v) return [] as unknown as T["en"];
  return ((v[lang] as T["en"]) || v.en) as T["en"];
}

export function isLang(x: string | null | undefined): Lang {
  return x === "zh" ? "zh" : "en";
}
