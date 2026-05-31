"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/modules/cart/store/cart.store";
import {
  calculateCartSubtotal,
  calculateCartTotalItems,
} from "@/modules/cart/utils/cart-calculations";
import { formatTRY } from "@/shared/utils/format-currency";


export function CartPageContent() {
  const items = useCartStore((state) => state.items);
  const incrementItem = useCartStore((state) => state.incrementItem);
  const decrementItem = useCartStore((state) => state.decrementItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const hasHydrated = useCartStore((state) => state.hasHydrated);

  const totalItems = calculateCartTotalItems(items);
  const subtotal = calculateCartSubtotal(items);

  if (!hasHydrated) {
    return (
      <section className="rounded-[var(--radius-brand-xl)] border border-brand-border bg-brand-white p-8 text-center">
        <p className="text-sm font-semibold text-brand-muted">
          Sepet yükleniyor...
        </p>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="rounded-[var(--radius-brand-xl)] border border-brand-border bg-brand-white p-8 text-center md:p-12">
        <h1 className="font-display text-3xl font-bold text-brand-text">
          Sepetiniz boş.
        </h1>

        <p className="mt-4 text-sm leading-7 text-brand-muted md:text-base">
          Ürünleri inceleyip sepete ekleyerek alışverişe başlayabilirsiniz.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-brand-primary px-6 py-3 font-semibold text-white transition hover:bg-brand-primary-dark"
        >
          Alışverişe Başla
        </Link>
      </section>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <section className="space-y-4">
        {items.map((item) => (
          <article
            key={item.variantId}
            className="rounded-[var(--radius-brand-lg)] border border-brand-border bg-brand-white p-5"
          >
            <div className="flex flex-col gap-5 sm:flex-row">
              <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl border border-brand-border bg-brand-surface">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.imageAlt ?? item.productName}
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                ) : null}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <Link
                      href={`/urun/${item.productSlug}`}
                      className="font-display text-xl font-bold text-brand-text transition hover:text-brand-primary-dark"
                    >
                      {item.productName}
                    </Link>

                    <p className="mt-2 text-sm text-brand-muted">
                      {item.categoryLabel}
                    </p>

                    <p className="mt-1 text-sm text-brand-muted">
                      {item.variantLabel}
                    </p>

                    <p className="mt-3 text-base font-bold text-brand-text">
                      {formatTRY(item.unitPrice, { decimals: false })}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.variantId)}
                    className="w-fit text-sm font-semibold text-brand-primary-dark transition hover:opacity-75"
                  >
                    Kaldır
                  </button>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                  <div className="inline-flex items-center rounded-full border border-brand-border bg-brand-surface">
                    <button
                      type="button"
                      onClick={() => decrementItem(item.variantId)}
                      className="px-4 py-2 text-base font-bold text-brand-text"
                    >
                      −
                    </button>

                    <span className="min-w-10 text-center text-sm font-bold text-brand-text">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() => incrementItem(item.variantId)}
                      className="px-4 py-2 text-base font-bold text-brand-text"
                    >
                      +
                    </button>
                  </div>

                  <p className="text-base font-bold text-brand-text">
                    {formatTRY(item.unitPrice * item.quantity, { decimals: false })}
                  </p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>

      <aside className="h-fit rounded-[var(--radius-brand-xl)] border border-brand-border bg-brand-white p-6 lg:sticky lg:top-28">
        <h2 className="font-display text-2xl font-bold text-brand-text">
          Sipariş Özeti
        </h2>

        <div className="mt-6 space-y-4 border-b border-brand-border pb-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-brand-muted">Ürün adedi</span>
            <span className="font-semibold text-brand-text">
              {totalItems}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-brand-muted">Ara toplam</span>
            <span className="font-semibold text-brand-text">
              {formatTRY(subtotal, { decimals: false })}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-brand-muted">Kargo</span>
            <span className="font-semibold text-brand-text">
              Sonraki adımda
            </span>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <span className="text-base font-semibold text-brand-muted">
            Toplam
          </span>

          <strong className="text-2xl font-bold text-brand-text">
            {formatTRY(subtotal, { decimals: false })}
          </strong>
        </div>

        <div className="mt-6 grid gap-3">
          <Link
            href="/odeme"
            className="rounded-full bg-brand-primary px-6 py-4 text-center font-semibold text-white transition hover:bg-brand-primary-dark"
          >
            Ödemeye Geç
          </Link>

          <button
            type="button"
            onClick={clearCart}
            className="rounded-full border border-brand-border bg-brand-white px-6 py-4 font-semibold text-brand-text transition hover:bg-brand-secondary"
          >
            Sepeti Temizle
          </button>
        </div>
      </aside>
    </div>
  );
}