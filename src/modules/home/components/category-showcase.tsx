import Link from "next/link";
import type { HomeCategoryCard } from "@/modules/home/types/home-content.types";

type CategoryShowcaseProps = {
  title?: string;
  description?: string;
  categories: HomeCategoryCard[];
};

/* Tailwind class yerine CSS class kullanıyoruz — inline hex renk
   server/client normalisation farkı hydration hatasına yol açıyordu. */
const TONE_CLASS = {
  rose:  { bg: "bg-[#FAF2F5]", dot: "text-[#C08898]" },
  sage:  { bg: "bg-[#EEF5F1]", dot: "text-[#6a9180]" },
  peach: { bg: "bg-[#FAF0EA]", dot: "text-[#C4866A]" },
} as const;

export function CategoryShowcase({
  title = "Kategoriler",
  description,
  categories,
}: CategoryShowcaseProps) {
  return (
    <section className="mt-16 md:mt-20">
      <div className="reveal mb-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink-3">
          Koleksiyonlar
        </p>
        <h2
          className="mt-2 font-display font-bold tracking-tight text-ink"
          style={{ fontSize: "clamp(1.5rem,1.1rem + 2vw,2.25rem)" }}
        >
          {title}
        </h2>
        {description && (
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink-3">
            {description}
          </p>
        )}
      </div>

      <div className="reveal-stagger grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {categories.map((cat) => {
          const tc =
            TONE_CLASS[cat.tone as keyof typeof TONE_CLASS] ?? TONE_CLASS.rose;
          return (
            <Link
              key={cat.id}
              href={cat.href}
              className={`group relative flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-transparent p-6 transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-[var(--shadow-md)] ${tc.bg}`}
            >
              {cat.badge && (
                <span className="mb-4 inline-flex w-fit rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-ink-2">
                  {cat.badge}
                </span>
              )}
              <h3 className="font-display text-xl font-bold text-ink">
                {cat.title}
              </h3>
              {cat.description && (
                <p className="mt-2 text-sm leading-relaxed text-ink-3">
                  {cat.description}
                </p>
              )}
              <div className="mt-6 flex items-center gap-2">
                <span
                  className={`text-sm font-semibold transition-all duration-200 group-hover:translate-x-1 ${tc.dot}`}
                >
                  Keşfet →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
