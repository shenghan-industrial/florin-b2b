"use client";

import { useT } from "@/lib/LanguageContext";

export default function LanguageSwitcher() {
  const { lang, setLang, t } = useT();
  return (
    <div className="lang-switch" role="group" aria-label={t("lang.label") || "Language"}>
      <button
        type="button"
        data-lang="en"
        className={`lang-switch__btn ${lang === "en" ? "is-active" : ""}`}
        onClick={() => setLang("en")}
      >
        EN
      </button>
      <button
        type="button"
        data-lang="zh"
        className={`lang-switch__btn ${lang === "zh" ? "is-active" : ""}`}
        onClick={() => setLang("zh")}
      >
        中文
      </button>
    </div>
  );
}
