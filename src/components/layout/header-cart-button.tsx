"use client";

import { calculateCartTotalItems } from "@/modules/cart/utils/cart-calculations";
import { useCartStore } from "@/modules/cart/store/cart.store";

export function HeaderCartButton() {
  const items = useCartStore((state) => state.items);
  const openDrawer = useCartStore((state) => state.openDrawer);
  const hasHydrated = useCartStore((state) => state.hasHydrated);

  const totalItems = hasHydrated
    ? calculateCartTotalItems(items)
    : 0;

  return (
    <button
      type="button"
      onClick={openDrawer}
      className="inline-flex items-center gap-2 rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-primary-dark"
    >
      <span>Sepet</span>

      <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-xs font-bold text-brand-primary-dark">
        {totalItems}
      </span>
    </button>
  );
}