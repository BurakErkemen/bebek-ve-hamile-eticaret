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

export function ProductShowcase({
  eyebrow = "Ürün Vitrini",
  title,
  description,
  actionLabel,
  actionHref,
  products,
}: ProductShowcaseProps) {
  return (
    <section className="mt-10 md:mt-14">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-sm font-bold uppercase tracking-[0.18em] text-brand-primary-dark">
            {eyebrow}
          </p>

          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-brand-text md:text-3xl">
            {title}
          </h2>

          {description ? (
            <p className="mt-3 max-w-2xl text-sm leading-6 text-brand-muted md:text-base">
              {description}
            </p>
          ) : null}
        </div>

        {actionLabel && actionHref ? (
          <Link
            href={actionHref}
            className="inline-flex shrink-0 items-center justify-center rounded-full border border-brand-border bg-brand-white px-5 py-3 text-sm font-semibold text-brand-text transition hover:bg-brand-secondary"
          >
            {actionLabel}
          </Link>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}