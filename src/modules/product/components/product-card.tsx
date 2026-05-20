import Image from "next/image";
import Link from "next/link";
import { ProductQuickAdd } from "@/modules/product/components/product-quick-add";
import type { ProductCardItem } from "@/modules/product/types/product-card.types";

type ProductCardProps = {
  product: ProductCardItem;
};

const toneStyles = {
  rose: "bg-[#fff2f6]",
  sage: "bg-[#eff8f3]",
  peach: "bg-[#fff5eb]",
} as const;

const currencyFormatter = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
});

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group overflow-hidden rounded-[var(--radius-brand-lg)] border border-brand-border bg-brand-white transition hover:-translate-y-1 hover:shadow-sm">
      <Link href={`/urun/${product.slug}`} className="block">
        <div
          className={`relative flex aspect-square items-center justify-center overflow-hidden ${toneStyles[product.tone]}`}
        >
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.imageAlt ?? product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center p-6 text-center">
              <div>
                <p className="font-display text-base font-bold text-brand-text">
                  Ürün görsel alanı
                </p>
                <p className="mt-2 text-sm leading-6 text-brand-muted">
                  İleride gerçek ürün fotoğrafları burada gösterilecek.
                </p>
              </div>
            </div>
          )}

          {product.badge ? (
            <span className="absolute left-4 top-4 rounded-full bg-brand-white px-3 py-1 text-xs font-bold text-brand-primary-dark shadow-sm">
              {product.badge}
            </span>
          ) : null}
        </div>

        <div className="p-5">
          <p className="text-sm font-medium text-brand-muted">
            {product.categoryLabel}
          </p>

          <h3 className="mt-2 min-h-14 font-display text-lg font-bold leading-7 text-brand-text">
            {product.name}
          </h3>

          <div className="mt-4 flex flex-wrap items-end gap-2">
            <span className="text-lg font-bold text-brand-text">
              {currencyFormatter.format(product.price)}
            </span>

            {product.compareAtPrice ? (
              <span className="text-sm font-medium text-brand-muted line-through">
                {currencyFormatter.format(product.compareAtPrice)}
              </span>
            ) : null}
          </div>
        </div>
      </Link>

      <div className="border-t border-brand-border px-5 py-4">
        <ProductQuickAdd product={product} />
      </div>
    </article>
  );
}
