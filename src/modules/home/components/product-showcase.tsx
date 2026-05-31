import Link from "next/link";
import { ProductCard } from "@/modules/product/components/product-card";
import type { ProductCardItem } from "@/modules/product/types/product-card.types";

type ProductShowcaseProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  products: ProductCardItem[];
};

export function ProductShowcase({ eyebrow = "Seçkiler", title, description, actionLabel, actionHref, products }: ProductShowcaseProps) {
  return (
    <section className="mt-16 md:mt-20">
      <div className="reveal mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink-3">{eyebrow}</p>
          <h2 className="mt-2 font-display font-bold tracking-tight text-ink"
            style={{ fontSize: "clamp(1.5rem,1.1rem + 2vw,2.25rem)" }}>
            {title}
          </h2>
          {description && (
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink-3">{description}</p>
          )}
        </div>
        {actionLabel && actionHref && (
          <Link href={actionHref}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-surface-card px-5 py-2.5 text-sm font-semibold text-ink-2 shadow-xs transition-all duration-200 hover:border-amber hover:text-amber hover:shadow-sm">
            {actionLabel}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
          </Link>
        )}
      </div>

      <div className="reveal-stagger grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
