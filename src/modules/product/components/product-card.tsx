import Image from "next/image";
import Link from "next/link";
import { formatTRY } from "@/shared/utils/format-currency";
import type { ProductCardItem } from "@/modules/product/types/product-card.types";

type ProductCardProps = { product: ProductCardItem };

const TONE_BG = {
  rose:  "#FAF2F5",
  sage:  "#EEF5F1",
  peach: "#FAF0EA",
} as const;

export function ProductCard({ product }: ProductCardProps) {
  const bg      = TONE_BG[product.tone as keyof typeof TONE_BG] ?? TONE_BG.rose;
  const onSale  = product.compareAtPrice && product.compareAtPrice > product.price;
  const discount = onSale ? Math.round((1 - product.price / product.compareAtPrice!) * 100) : null;

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border/60 bg-surface-card shadow-[var(--shadow-xs)] transition-all duration-300 hover:-translate-y-1.5 hover:border-border hover:shadow-[var(--shadow-lg)]"
    >
      <Link href={`/urun/${product.slug}`} className="flex flex-1 flex-col" tabIndex={-1} aria-hidden="true">
        {/* Görsel */}
        <div className="relative aspect-[4/3] w-full overflow-hidden" style={{ backgroundColor: bg }}>
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.imageAlt ?? product.name}
              fill
              sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            /* Zarif boş durum — ürün adıyla */
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border/60 bg-white/60">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="text-ink-4" aria-hidden="true">
                  <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                  <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                </svg>
              </div>
              <p className="text-center text-xs font-medium leading-snug text-ink-4 line-clamp-2">{product.name}</p>
            </div>
          )}

          {/* Rozetler */}
          <div className="absolute left-2.5 top-2.5 flex flex-col gap-1.5">
            {discount !== null && (
              <span className="rounded-full bg-amber px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                -{discount}%
              </span>
            )}
            {product.badge && !discount && (
              <span className="rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-bold text-ink-2 shadow-xs backdrop-blur-sm">
                {product.badge}
              </span>
            )}
          </div>
        </div>

        {/* Bilgi */}
        <div className="flex flex-1 flex-col gap-1 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-ink-4">{product.categoryLabel}</p>
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-ink transition-colors duration-200 group-hover:text-amber">
            {product.name}
          </h3>
          {product.selectedVariant && (
            <div className="flex items-center gap-1.5 pt-0.5">
              {product.selectedVariant.colorHex && (
                <span className="h-3 w-3 shrink-0 rounded-full border border-border shadow-xs"
                  style={{ backgroundColor: product.selectedVariant.colorHex }} aria-hidden="true" />
              )}
              <span className="text-xs text-ink-3">{product.selectedVariant.label}</span>
            </div>
          )}
          <div className="mt-auto flex items-baseline gap-2 pt-3">
            <span className="text-base font-bold text-ink">
              {formatTRY(product.price, { decimals: false })}
            </span>
            {onSale && (
              <span className="text-xs text-ink-4 line-through">
                {formatTRY(product.compareAtPrice!, { decimals: false })}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Erişilebilir bağlantı */}
      <Link
        href={`/urun/${product.slug}`}
        className="absolute inset-0 rounded-[var(--radius-lg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-2"
        aria-label={`${product.name} — ${formatTRY(product.price, { decimals: false })}`}
      />
    </article>
  );
}
