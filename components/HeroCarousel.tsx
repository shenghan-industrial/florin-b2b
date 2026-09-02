"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLang } from "@/lib/LanguageContext";
import { pickLang } from "@/lib/localize";
import type { HeroSlide } from "@/lib/types";

// 首页轮播：3 屏自动轮播 + 箭头 + 圆点 + 触摸滑动（静态站 main.js 的等价实现）
export default function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const lang = useLang();
  const [idx, setIdx] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchX = useRef<number | null>(null);

  const go = useCallback(
    (i: number) => {
      setIdx((i + slides.length) % slides.length);
      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(-${((i + slides.length) % slides.length) * 100}%)`;
      }
    },
    [slides.length]
  );

  useEffect(() => {
    timerRef.current = setInterval(() => go((idx + 1) % slides.length), 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [idx, go, slides.length]);

  const restart = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setIdx((prev) => (prev + 1) % slides.length), 5000);
  };

  useEffect(() => {
    // 语言/索引变化时同步位移
    if (trackRef.current) trackRef.current.style.transform = `translateX(-${idx * 100}%)`;
  }, [idx, lang]);

  return (
    <div
      className="hero-carousel"
      onMouseEnter={() => timerRef.current && clearInterval(timerRef.current)}
      onMouseLeave={restart}
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (dx > 40) go(idx - 1);
        else if (dx < -40) go(idx + 1);
        touchX.current = null;
      }}
    >
      <div className="hero-carousel__track" ref={trackRef}>
        {slides.map((s, i) => (
          <div
            key={i}
            className="hero-slide"
            style={{ backgroundImage: `url('${s.image}')` }}
          >
            <div className="hero-slide__overlay">
              {pickLang(s.title, lang) && <h2 className="hero-slide__title">{pickLang(s.title, lang)}</h2>}
              {pickLang(s.sub, lang) && <p className="hero-slide__sub">{pickLang(s.sub, lang)}</p>}
              {pickLang(s.btn, lang) && (
                <Link className="btn btn--red" href={s.link}>
                  {pickLang(s.btn, lang)}
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
      <button className="hero-carousel__nav hero-carousel__prev" aria-label="Previous" onClick={() => go(idx - 1)}>
        ‹
      </button>
      <button className="hero-carousel__nav hero-carousel__next" aria-label="Next" onClick={() => go(idx + 1)}>
        ›
      </button>
      <div className="hero-carousel__dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`hero-carousel__dot ${i === idx ? "is-active" : ""}`}
            aria-label={`Slide ${i + 1}`}
            onClick={() => go(i)}
          />
        ))}
      </div>
    </div>
  );
}
