import Link from "next/link";
import type { HomePromoBanner } from "@/modules/home/types/home-content.types";

type PromoBannerProps = {
  banner: HomePromoBanner;
};

const toneStyles = {
  rose: {
    wrapper: "from-[#fff1f5] via-[#fff8fa] to-[#fce7ee]",
    badge: "bg-brand-primary/15 text-brand-primary-dark",
    accent: "bg-brand-primary/20",
  },
  sage: {
    wrapper: "from-[#eff9f3] via-[#f8fdfb] to-[#e7f4ed]",
    badge: "bg-brand-accent/40 text-[#4f7761]",
    accent: "bg-brand-accent/35",
  },
  peach: {
    wrapper: "from-[#fff4ea] via-[#fffaf5] to-[#fce8d7]",
    badge: "bg-brand-secondary text-brand-text",
    accent: "bg-brand-secondary",
  },
} as const;

export function PromoBanner({ banner }: PromoBannerProps) {
  const tone = toneStyles[banner.tone];

  const hasAction = banner.actionLabel && banner.actionHref;

  return (
    <section
      className={`relative mt-10 overflow-hidden rounded-[var(--radius-brand-xl)] border border-brand-border bg-gradient-to-br ${tone.wrapper} p-6 md:mt-14 md:p-8 lg:p-10`}
    >
      <div
        className={`pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full blur-2xl ${tone.accent}`}
      />

      <div
        className={`pointer-events-none absolute -bottom-16 left-1/3 h-44 w-44 rounded-full blur-3xl ${tone.accent}`}
      />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl">
          {banner.eyebrow ? (
            <span
              className={`inline-flex rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] ${tone.badge}`}
            >
              {banner.eyebrow}
            </span>
          ) : null}

          <h2 className="mt-5 font-display text-2xl font-bold tracking-tight text-brand-text md:text-4xl">
            {banner.title}
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-brand-muted md:text-base">
            {banner.description}
          </p>
        </div>

        {hasAction ? (
          <Link
            href={banner.actionHref as string}
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-brand-primary px-6 py-3 font-semibold text-white transition hover:bg-brand-primary-dark"
          >
            {banner.actionLabel}
          </Link>
        ) : null}
      </div>
    </section>
  );
}