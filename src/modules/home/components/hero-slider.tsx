"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { HeroSlide } from "@/modules/home/types/home-content.types";

type HeroSliderProps = {
  slides: HeroSlide[];
};

const toneStyles = {
  rose: {
    panel: "from-[#fff3f6] via-[#fff8fa] to-[#fdf0f4]",
    badge: "bg-brand-primary/15 text-brand-primary-dark",
    visual: "bg-brand-primary/15",
  },
  sage: {
    panel: "from-[#f1fbf6] via-[#f8fdfb] to-[#edf7f1]",
    badge: "bg-brand-accent/35 text-[#4f7761]",
    visual: "bg-brand-accent/35",
  },
  peach: {
    panel: "from-[#fff6ee] via-[#fffaf5] to-[#fdf0e5]",
    badge: "bg-brand-secondary text-brand-text",
    visual: "bg-brand-secondary",
  },
} as const;

export function HeroSlider({ slides }: HeroSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const hasMultipleSlides = slides.length > 1;

  const goToPrev = useCallback(() => {
    setActiveIndex((index) => (index - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToNext = useCallback(() => {
    setActiveIndex((index) => (index + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (!hasMultipleSlides) return;
    const timer = setInterval(goToNext, 6000);
    return () => clearInterval(timer);
  }, [hasMultipleSlides, goToNext, activeIndex]);

  const activeSlide = slides[activeIndex];

  const currentTone = useMemo(() => {
    return toneStyles[activeSlide.tone];
  }, [activeSlide.tone]);

  const hasPrimaryAction =
    activeSlide.primaryActionLabel && activeSlide.primaryActionHref;

  const hasSecondaryAction =
    activeSlide.secondaryActionLabel && activeSlide.secondaryActionHref;

  return (
    <section
      className={`overflow-hidden rounded-[var(--radius-brand-xl)] border border-brand-border bg-gradient-to-br ${currentTone.panel}`}
      aria-label="Ana sayfa slider alanı"
    >
      <div className="grid gap-8 px-5 py-6 md:grid-cols-[1.15fr_0.85fr] md:px-8 md:py-10 lg:px-12 lg:py-12">
        <div className="flex flex-col justify-center">
          {activeSlide.eyebrow ? (
            <span
              className={`mb-4 inline-flex w-fit rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] ${currentTone.badge}`}
            >
              {activeSlide.eyebrow}
            </span>
          ) : null}

          <h1 className="max-w-3xl font-display text-3xl font-bold tracking-tight text-brand-text md:text-5xl">
            {activeSlide.title}
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-brand-muted md:text-lg">
            {activeSlide.description}
          </p>

          {hasPrimaryAction || hasSecondaryAction ? (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {hasPrimaryAction ? (
                <Link
                  href={activeSlide.primaryActionHref as string}
                  className="inline-flex items-center justify-center rounded-full bg-brand-primary px-6 py-3 font-semibold text-white transition hover:bg-brand-primary-dark"
                >
                  {activeSlide.primaryActionLabel}
                </Link>
              ) : null}

              {hasSecondaryAction ? (
                <Link
                  href={activeSlide.secondaryActionHref as string}
                  className="inline-flex items-center justify-center rounded-full border border-brand-border bg-brand-white px-6 py-3 font-semibold text-brand-text transition hover:bg-brand-secondary"
                >
                  {activeSlide.secondaryActionLabel}
                </Link>
              ) : null}
            </div>
          ) : null}

          {hasMultipleSlides ? (
            <div className="mt-8 flex items-center gap-3" aria-label="Slider seçimleri">
              <button
                type="button"
                onClick={goToPrev}
                aria-label="Önceki slayt"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brand-border bg-brand-white text-brand-text transition hover:border-brand-primary hover:text-brand-primary-dark"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>

              <div className="flex items-center gap-2">
                {slides.map((slide, index) => {
                  const isActive = index === activeIndex;

                  return (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      aria-label={`${index + 1}. slayta geç`}
                      aria-pressed={isActive}
                      className={`h-3 rounded-full transition-all ${
                        isActive
                          ? "w-10 bg-brand-primary"
                          : "w-3 bg-brand-primary/30 hover:bg-brand-primary/60"
                      }`}
                    />
                  );
                })}
              </div>

              <button
                type="button"
                onClick={goToNext}
                aria-label="Sonraki slayt"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brand-border bg-brand-white text-brand-text transition hover:border-brand-primary hover:text-brand-primary-dark"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          ) : null}
        </div>

        <div className="flex min-h-[280px] items-center justify-center md:min-h-[360px]">
          <div
            className={`relative flex h-full min-h-[280px] w-full items-center justify-center overflow-hidden rounded-[var(--radius-brand-lg)] border border-white/70 ${currentTone.visual} md:min-h-[360px]`}
          >
            {activeSlide.imageUrl ? (
              <Image
                src={activeSlide.imageUrl}
                alt={activeSlide.imageAlt ?? activeSlide.title}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                priority
                className="object-cover"
              />
            ) : (
              <>
                <div className="absolute inset-5 rounded-[var(--radius-brand-md)] border border-white/70 bg-white/35" />

                <div className="relative z-10 max-w-xs px-6 text-center">
                  <p className="font-display text-lg font-bold text-brand-text">
                    Dinamik görsel alanı
                  </p>
                  <p className="mt-3 text-sm leading-6 text-brand-muted">
                    Bu slayt için görsel eklenmedi. Yönetim panelinden bir görsel
                    yükleyince burada görünecek.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}