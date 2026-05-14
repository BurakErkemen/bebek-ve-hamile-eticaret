import Link from "next/link";
import type { HomeCategoryCard } from "@/modules/home/types/home-content.types";

type CategoryShowcaseProps = {
  title?: string;
  description?: string;
  categories: HomeCategoryCard[];
};

const toneStyles = {
  rose: "bg-[#fff2f6]",
  sage: "bg-[#eff8f3]",
  peach: "bg-[#fff5eb]",
} as const;

export function CategoryShowcase({
  title = "Ana alışveriş alanları",
  description = "Bu kartlar ileride kategori yönetimi ve ana sayfa sıralama sistemiyle tamamen dinamik hâle gelecek.",
  categories,
}: CategoryShowcaseProps) {
  return (
    <section className="mt-10 md:mt-14">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-sm font-bold uppercase tracking-[0.18em] text-brand-primary-dark">
            Kategoriler
          </p>

          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-brand-text md:text-3xl">
            {title}
          </h2>
        </div>

        <p className="max-w-xl text-sm leading-6 text-brand-muted md:text-base">
          {description}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={category.href}
            className={`group rounded-[var(--radius-brand-lg)] border border-brand-border p-5 transition hover:-translate-y-1 hover:shadow-sm ${toneStyles[category.tone]}`}
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display text-xl font-bold text-brand-text">
                {category.title}
              </h3>

              {category.badge ? (
                <span className="rounded-full bg-brand-white px-3 py-1 text-xs font-bold text-brand-primary-dark">
                  {category.badge}
                </span>
              ) : null}
            </div>

            <p className="mt-4 text-sm leading-6 text-brand-muted">
              {category.description}
            </p>

            <div className="mt-6 inline-flex items-center text-sm font-semibold text-brand-primary-dark transition group-hover:translate-x-1">
              Kategoriyi Gör
              <span className="ml-2">→</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}