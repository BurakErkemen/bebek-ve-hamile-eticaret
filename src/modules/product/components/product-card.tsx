import Image from "next/image";
import Link from "next/link";
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
  maximumFractionDigits: 0,
});

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-brand-border bg-brand-white transition hover:-translate-y-0.5 hover:shadow-md">
      <Link href={`/urun/${product.slug}`} className="flex flex-col flex-1">
        {/* Görsel */}
        <div className={`relative aspect-[4/3] w-full overflow-hidden ${toneStyles[product.tone]}`}>
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.imageAlt ?? product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="text-brand-muted/40">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-6-6L5 21" />
              </svg>
            </div>
          )}

          {product.badge && (
            <span className="absolute left-3 top-3 rounded-full bg-brand-white/90 px-2.5 py-1 text-xs font-bold text-brand-primary-dark shadow-sm backdrop-blur-sm">
              {product.badge}
            </span>
          )}
        </div>

        {/* Bilgi */}
        <div className="flex flex-1 flex-col gap-1 p-4">
          <p className="text-xs font-medium text-brand-muted">
            {product.categoryLabel}
          </p>
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-brand-text">
            {product.name}
          </h3>

          {product.selectedVariant && (
            <div className="flex items-center gap-1.5 pt-1">
              {product.selectedVariant.colorHex && (
                <span
                  className="h-3.5 w-3.5 shrink-0 rounded-full border border-brand-border"
                  style={{ backgroundColor: product.selectedVariant.colorHex }}
                />
              )}
              <span className="text-xs font-medium text-brand-muted">
                {product.selectedVariant.label}
              </span>
            </div>
          )}

          <div className="mt-auto flex items-baseline gap-2 pt-2">
            <span className="text-base font-bold text-brand-text">
              {currencyFormatter.format(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs font-medium text-brand-muted line-through">
                {currencyFormatter.format(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
