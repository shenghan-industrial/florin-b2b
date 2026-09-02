"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import en from "@/messages/en.json";
import zh from "@/messages/zh.json";
import type { Lang } from "./localize";

const DICTS: Record<Lang, Record<string, string>> = { en, zh };
const STORAGE_KEY = "florin_lang";

interface LanguageCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const Ctx = createContext<LanguageCtx>({
  lang: "en",
  setLang: () => {},
  t: (k) => k,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  // 挂载后读取 localStorage；未保存过偏好则默认中文（SSR 恒为 en，SEO 输出英文 HTML 不受影响）
  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (stored === "en" || stored === "zh") {
      setLangState(stored);
    } else {
      setLangState("zh");
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {}
  }, []);

  const t = useCallback(
    (key: string) => DICTS[lang][key] || DICTS.en[key] || key,
    [lang]
  );

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export function useT() {
  return useContext(Ctx);
}

export function useLang() {
  return useContext(Ctx).lang;
}
