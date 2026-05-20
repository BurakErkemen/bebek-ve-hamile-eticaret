import type { CartItem } from "@/modules/cart/types/cart.types";

export function calculateCartTotalItems(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.quantity, 0);
}

export function calculateCartSubtotal(items: CartItem[]): number {
  return items.reduce((total, item) => {
    return total + item.unitPrice * item.quantity;
  }, 0);
}