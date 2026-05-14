"use client";

import { useMemo, useState } from "react";
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

  const activeSlide = slides[activeIndex];

  const currentTone = useMemo(() => {
    return toneStyles[activeSlide.tone];
  }, [activeSlide.tone]);

  return (
    <section
      className={`overflow-hidden rounded-[var(--radius-brand-xl)] border border-brand-border bg-gradient-to-br ${currentTone.panel}`}
      aria-label="Ana sayfa slider alanı"
    >
      <div className="grid gap-8 px-5 py-6 md:grid-cols-[1.15fr_0.85fr] md:px-8 md:py-10 lg:px-12 lg:py-12">
        <div className="flex flex-col justify-center">
          <span
            className={`mb-4 inline-flex w-fit rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] ${currentTone.badge}`}
          >
            {activeSlide.eyebrow}
          </span>

          <h1 className="max-w-3xl font-display text-3xl font-bold tracking-tight text-brand-text md:text-5xl">
            {activeSlide.title}
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-brand-muted md:text-lg">
            {activeSlide.description}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={activeSlide.primaryActionHref}
              className="inline-flex items-center justify-center rounded-full bg-brand-primary px-6 py-3 font-semibold text-white transition hover:bg-brand-primary-dark"
            >
              {activeSlide.primaryActionLabel}
            </Link>

            {activeSlide.secondaryActionLabel &&
            activeSlide.secondaryActionHref ? (
              <Link
                href={activeSlide.secondaryActionHref}
                className="inline-flex items-center justify-center rounded-full border border-brand-border bg-brand-white px-6 py-3 font-semibold text-brand-text transition hover:bg-brand-secondary"
              >
                {activeSlide.secondaryActionLabel}
              </Link>
            ) : null}
          </div>

          <div className="mt-8 flex items-center gap-2" aria-label="Slider seçimleri">
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
        </div>

        <div className="flex min-h-[280px] items-center justify-center md:min-h-[360px]">
          <div
            className={`relative flex h-full min-h-[280px] w-full items-center justify-center rounded-[var(--radius-brand-lg)] border border-white/70 ${currentTone.visual} md:min-h-[360px]`}
          >
            <div className="absolute inset-5 rounded-[var(--radius-brand-md)] border border-white/70 bg-white/35" />

            <div className="relative z-10 max-w-xs px-6 text-center">
              <p className="font-display text-lg font-bold text-brand-text">
                Dinamik görsel alanı
              </p>
              <p className="mt-3 text-sm leading-6 text-brand-muted">
                Bu bölüm ileride admin panelden yönetilen slider görselleriyle
                beslenecek.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}