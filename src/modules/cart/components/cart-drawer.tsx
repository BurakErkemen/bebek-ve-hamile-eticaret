"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useCartStore } from "@/modules/cart/store/cart.store";
import {
  calculateCartSubtotal,
  calculateCartTotalItems,
} from "@/modules/cart/utils/cart-calculations";
import { formatTRY } from "@/shared/utils/format-currency";


export function CartDrawer() {
  const items = useCartStore((state) => state.items);
  const isDrawerOpen = useCartStore((state) => state.isDrawerOpen);
  const closeDrawer = useCartStore((state) => state.closeDrawer);
  const incrementItem = useCartStore((state) => state.incrementItem);
  const decrementItem = useCartStore((state) => state.decrementItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const hasHydrated = useCartStore((state) => state.hasHydrated);

  useEffect(() => {
    if (!isDrawerOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  if (!isDrawerOpen) {
    return null;
  }

  const totalItems = calculateCartTotalItems(items);
  const subtotal = calculateCartSubtotal(items);

  return (
    <div className="fixed inset-0 z-[70]">
      <button
        type="button"
        aria-label="Sepeti kapat"
        onClick={closeDrawer}
        className="absolute inset-0 bg-black/35"
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-brand-border bg-brand-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-brand-border px-5 py-5">
          <div>
            <h2 className="font-display text-xl font-bold text-brand-text">
              Sepetim
            </h2>
            <p className="mt-1 text-sm text-brand-muted">
              {hasHydrated ? `${totalItems} ürün` : "Sepet yükleniyor..."}
            </p>
          </div>

          <button
            type="button"
            onClick={closeDrawer}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-border bg-brand-surface text-xl font-semibold text-brand-text transition hover:bg-brand-secondary"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {items.length === 0 ? (
            <div className="rounded-[var(--radius-brand-lg)] border border-dashed border-brand-border bg-brand-surface p-6 text-center">
              <h3 className="font-display text-lg font-bold text-brand-text">
                Sepetiniz boş.
              </h3>

              <p className="mt-3 text-sm leading-6 text-brand-muted">
                Ürün detay sayfalarından ürün ekleyerek alışverişe
                başlayabilirsiniz.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <article
                  key={item.variantId}
                  className="rounded-[var(--radius-brand-lg)] border border-brand-border bg-brand-surface p-4"
                >
                  <div className="flex gap-4">
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-brand-border bg-white">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.imageAlt ?? item.productName}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      ) : null}
                    </div>

                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/urun/${item.productSlug}`}
                        onClick={closeDrawer}
                        className="font-display text-base font-bold leading-6 text-brand-text transition hover:text-brand-primary-dark"
                      >
                        {item.productName}
                      </Link>

                      <p className="mt-1 text-sm text-brand-muted">
                        {item.variantLabel}
                      </p>

                      <p className="mt-2 text-sm font-semibold text-brand-text">
                        {formatTRY(item.unitPrice, { decimals: false })}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="inline-flex items-center rounded-full border border-brand-border bg-brand-white">
                      <button
                        type="button"
                        onClick={() => decrementItem(item.variantId)}
                        className="px-4 py-2 text-base font-bold text-brand-text"
                      >
                        −
                      </button>

                      <span className="min-w-8 text-center text-sm font-bold text-brand-text">
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

                    <button
                      type="button"
                      onClick={() => removeItem(item.variantId)}
                      className="text-sm font-semibold text-brand-primary-dark transition hover:opacity-75"
                    >
                      Kaldır
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-brand-border px-5 py-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-brand-muted">
              Ara Toplam
            </span>

            <strong className="text-xl font-bold text-brand-text">
              {formatTRY(subtotal, { decimals: false })}
            </strong>
          </div>

          <div className="mt-4 grid gap-3">
            <Link
              href="/sepet"
              onClick={closeDrawer}
              className="inline-flex items-center justify-center rounded-full bg-brand-primary px-6 py-4 font-semibold text-white transition hover:bg-brand-primary-dark"
            >
              Sepete Git
            </Link>

            <button
              type="button"
              disabled={items.length === 0}
              className="rounded-full border border-brand-border bg-brand-secondary px-6 py-4 font-semibold text-brand-text transition hover:bg-brand-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Hızlı Ödeme
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}