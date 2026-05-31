"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { HeroSlide } from "@/modules/home/types/home-content.types";

gsap.registerPlugin(ScrollTrigger);

type HeroSliderProps = { slides: HeroSlide[] };

const TONE = {
  rose:  { bg: "linear-gradient(135deg,#FAF2F5 0%,#FBF8F3 55%,#F5EFE6 100%)", blob1: "#E8BFCA", blob2: "#F0D5DC", dot: "#C08898", eyebrow: "#C08898" },
  sage:  { bg: "linear-gradient(135deg,#EEF5F1 0%,#FBF8F3 55%,#F0EBE2 100%)", blob1: "#A8C8B8", blob2: "#C4DCCF", dot: "#6a9180", eyebrow: "#6a9180" },
  peach: { bg: "linear-gradient(135deg,#FAF0EA 0%,#FBF8F3 55%,#F5EFE6 100%)", blob1: "#D4A88A", blob2: "#E8C4A8", dot: "#C4866A", eyebrow: "#C4866A" },
} as const;

export function HeroSlider({ slides }: HeroSliderProps) {
  const [idx, setIdx] = useState(0);
  const [out, setOut] = useState(false);
  const sectionRef    = useRef<HTMLElement>(null);
  const blob1Ref      = useRef<HTMLDivElement>(null);
  const blob2Ref      = useRef<HTMLDivElement>(null);
  const imgRef        = useRef<HTMLDivElement>(null);

  const slide = slides[idx];
  const tone  = TONE[slide.tone as keyof typeof TONE] ?? TONE.rose;
  const multi = slides.length > 1;

  useEffect(() => {
    if (!sectionRef.current) return;
    let ctx: gsap.Context | undefined;

    // requestAnimationFrame ile React hydration'dan sonraya ertele
    const raf = requestAnimationFrame(() => {
      if (!sectionRef.current) return;
      ctx = gsap.context(() => {
        [
          { ref: blob1Ref, y: -90,  x:  20, scrub: 1.4 },
          { ref: blob2Ref, y: -130, x: -20, scrub: 2   },
          { ref: imgRef,   y: -50,  x:   0, scrub: 1.1 },
        ].forEach(({ ref, y, x, scrub }) => {
          if (!ref.current) return;
          gsap.to(ref.current, {
            y, x, ease: "none",
            scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub },
          });
        });
      }, sectionRef);
    });

    return () => {
      cancelAnimationFrame(raf);
      ctx?.revert();
    };
  }, []);

  const goTo = useCallback((next: number) => {
    if (out) return;
    setOut(true);
    setTimeout(() => { setIdx(next); setOut(false); }, 240);
  }, [out]);

  const prev = useCallback(() => goTo((idx - 1 + slides.length) % slides.length), [idx, slides.length, goTo]);
  const next = useCallback(() => goTo((idx + 1) % slides.length),                  [idx, slides.length, goTo]);

  useEffect(() => {
    if (!multi) return;
    const t = setInterval(next, 7000);
    return () => clearInterval(t);
  }, [multi, next]);

  const hasPrimary   = slide.primaryActionLabel && slide.primaryActionHref;
  const hasSecondary = slide.secondaryActionLabel && slide.secondaryActionHref;

  return (
    <section
      ref={sectionRef}
      aria-label="Ana sayfa hero"
      className="relative overflow-hidden rounded-[var(--radius-xl)] md:rounded-[var(--radius-2xl)]"
      style={{ background: tone.bg, minHeight: "min(72vh,640px)" }}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div ref={blob1Ref} className="blob absolute -bottom-24 -left-20 h-[440px] w-[440px] opacity-35 blur-3xl transition-colors duration-700"
          style={{ backgroundColor: tone.blob1 }} />
        <div ref={blob2Ref} className="blob-alt absolute -right-24 -top-24 h-[360px] w-[360px] opacity-25 blur-3xl transition-colors duration-700"
          style={{ backgroundColor: tone.blob2 }} />
        <div className="absolute inset-0 opacity-[0.045]"
          style={{ background: "linear-gradient(115deg,transparent 38%,#FFF8E8 54%,transparent 70%)" }} />
        <div className="animate-float-a absolute right-[30%] top-10 h-2.5 w-2.5 rounded-full bg-white/60" />
        <div className="animate-float-b absolute bottom-20 left-[24%] h-2 w-2 rounded-full bg-white/50" />
        <div className="animate-float-c absolute left-[46%] top-[38%] h-1.5 w-1.5 rounded-full bg-white/40" />
      </div>

      <div className="relative z-10 grid min-h-[inherit] items-center gap-8 px-6 py-12 md:grid-cols-2 md:px-10 md:py-16 lg:px-14 lg:py-20">
        <div className={`flex flex-col transition-all duration-300 ${out ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}>
          {slide.eyebrow && (
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em]" style={{ color: tone.eyebrow }}>
              ◆&ensp;{slide.eyebrow}
            </p>
          )}
          <h1 className="font-display font-bold leading-[1.05] tracking-tight text-ink"
            style={{ fontSize: "clamp(2rem,1.2rem + 4vw,4rem)" }}>
            {slide.title}
          </h1>
          {slide.description && (
            <p className="mt-5 max-w-md leading-relaxed text-ink-2"
              style={{ fontSize: "clamp(0.9rem,0.84rem + 0.3vw,1.1rem)" }}>
              {slide.description}
            </p>
          )}
          {(hasPrimary || hasSecondary) && (
            <div className="mt-8 flex flex-wrap gap-3">
              {hasPrimary && (
                <Link href={slide.primaryActionHref!} className="btn-amber text-sm">
                  {slide.primaryActionLabel}
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
                </Link>
              )}
              {hasSecondary && (
                <Link href={slide.secondaryActionHref!} className="btn-ghost text-sm">
                  {slide.secondaryActionLabel}
                </Link>
              )}
            </div>
          )}
          {multi && (
            <div className="mt-10 flex items-center gap-3">
              <button type="button" onClick={prev} aria-label="Önceki slayt"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white/80 text-ink-3 shadow-xs transition hover:bg-white hover:text-ink">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
              </button>
              <div className="flex items-center gap-2">
                {slides.map((_, i) => (
                  <button key={i} type="button" onClick={() => goTo(i)}
                    aria-label={`${i + 1}. slayt`} aria-current={i === idx ? "true" : undefined}
                    className="h-1.5 rounded-full transition-all duration-300"
                    style={{ width: i === idx ? "2rem" : "0.375rem", backgroundColor: i === idx ? tone.dot : "var(--border)" }}
                  />
                ))}
              </div>
              <button type="button" onClick={next} aria-label="Sonraki slayt"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white/80 text-ink-3 shadow-xs transition hover:bg-white hover:text-ink">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
              </button>
            </div>
          )}
        </div>

        {/*
          Sağ görsel alanı:
          - Görsel varsa → her ekranda göster
          - Görsel yoksa → mobilde (< md) gizle, boşluk bırakma;
            tablet+ placeholder göster
        */}
        <div
          ref={imgRef}
          className={`relative items-center justify-center transition-all duration-300 ${
            slide.imageUrl ? "flex" : "hidden md:flex"
          } ${out ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
          style={{ minHeight: "clamp(200px,34vw,460px)" }}
        >
          {slide.imageUrl ? (
            <div
              className="relative w-full overflow-hidden rounded-[var(--radius-lg)] shadow-lg"
              style={{ minHeight: "clamp(200px,34vw,460px)" }}
            >
              <Image
                src={slide.imageUrl}
                alt={slide.imageAlt ?? slide.title}
                fill
                sizes="(max-width:768px) 100vw, 48vw"
                priority
                className="object-cover"
              />
            </div>
          ) : (
            <div
              className="relative flex w-full items-center justify-center overflow-hidden rounded-[var(--radius-lg)]"
              style={{ minHeight: "clamp(200px,34vw,460px)", background: "rgb(255 255 255 / 0.50)" }}
            >
              <div className="absolute inset-6 rounded-[var(--radius-md)] border border-white/60 bg-white/30" />
              <div
                className="absolute inset-0 opacity-20"
                style={{ background: "linear-gradient(125deg,transparent 30%,rgb(255 248 220 / 0.9) 54%,transparent 76%)" }}
              />
              <div className="relative z-10 flex flex-col items-center gap-3 px-8 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border/50 bg-white/70">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="text-ink-4" aria-hidden="true">
                    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                    <circle cx="12" cy="13" r="3" />
                  </svg>
                </div>
                <p className="font-display text-sm font-semibold text-ink-3">Koleksiyon Görseli</p>
                <p className="text-xs text-ink-4">Admin panelden görsel ekleyin</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
