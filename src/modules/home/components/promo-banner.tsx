import Link from "next/link";
import type { HomePromoBanner } from "@/modules/home/types/home-content.types";

type PromoBannerProps = { banner: HomePromoBanner };

/* Tailwind arbitrary classes — inline style kullanmıyoruz, hydration mismatch önlendi */
const TONE_CLASS = {
  rose:  {
    section: "bg-[#FAF2F5]",
    blob1:   "bg-[#E8BFCA]",
    blob2:   "bg-[#E8BFCA]",
  },
  sage:  {
    section: "bg-[#EEF5F1]",
    blob1:   "bg-[#A8C8B8]",
    blob2:   "bg-[#A8C8B8]",
  },
  peach: {
    section: "bg-[#FAF0EA]",
    blob1:   "bg-[#D4A88A]",
    blob2:   "bg-[#D4A88A]",
  },
} as const;

export function PromoBanner({ banner }: PromoBannerProps) {
  const tc =
    TONE_CLASS[banner.tone as keyof typeof TONE_CLASS] ?? TONE_CLASS.rose;
  const hasAction = banner.actionLabel && banner.actionHref;

  return (
    <section
      className={`reveal relative mt-16 overflow-hidden rounded-[var(--radius-xl)] md:mt-20 ${tc.section}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className={`blob absolute -right-20 -top-20 h-72 w-72 opacity-30 blur-3xl ${tc.blob1}`}
        />
        <div
          className={`blob-alt absolute -bottom-24 left-1/4 h-56 w-56 opacity-20 blur-3xl ${tc.blob2}`}
        />
      </div>

      <div className="relative z-10 flex flex-col gap-6 px-8 py-10 lg:flex-row lg:items-center lg:justify-between lg:px-12 lg:py-12">
        <div className="max-w-2xl">
          {banner.eyebrow && (
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-amber">
              ◆&ensp;{banner.eyebrow}
            </p>
          )}
          <h2
            className="font-display font-bold tracking-tight text-ink"
            style={{ fontSize: "clamp(1.4rem,1rem + 2.2vw,2.5rem)" }}
          >
            {banner.title}
          </h2>
          {banner.description && (
            <p
              className="mt-4 max-w-xl leading-relaxed text-ink-2"
              style={{ fontSize: "clamp(0.875rem,0.82rem + 0.28vw,1.05rem)" }}
            >
              {banner.description}
            </p>
          )}
        </div>
        {hasAction && (
          <Link href={banner.actionHref!} className="btn-amber shrink-0 text-sm">
            {banner.actionLabel}
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Link>
        )}
      </div>
    </section>
  );
}
