import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type {
  AddCartItemInput,
  CartItem,
} from "@/modules/cart/types/cart.types";

type CartStore = {
  items: CartItem[];
  isDrawerOpen: boolean;
  hasHydrated: boolean;

  addItem: (input: AddCartItemInput) => void;
  removeItem: (variantId: string) => void;
  incrementItem: (variantId: string) => void;
  decrementItem: (variantId: string) => void;
  clearCart: () => void;

  openDrawer: () => void;
  closeDrawer: () => void;
  setHasHydrated: (value: boolean) => void;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      isDrawerOpen: false,
      hasHydrated: false,

      addItem: (input) =>
        set((state) => {
          if (input.stockQuantity <= 0) {
            return state;
          }

          const existingItem = state.items.find(
            (item) => item.variantId === input.variantId,
          );

          if (existingItem) {
            return {
              ...state,
              items: state.items.map((item) => {
                if (item.variantId !== input.variantId) {
                  return item;
                }

                const nextQuantity = Math.min(
                  item.quantity + (input.quantity ?? 1),
                  item.stockQuantity,
                );

                return {
                  ...item,
                  quantity: nextQuantity,
                };
              }),
            };
          }

          const firstQuantity = Math.min(
            input.quantity ?? 1,
            input.stockQuantity,
          );

          return {
            ...state,
            items: [
              ...state.items,
              {
                ...input,
                quantity: firstQuantity,
              },
            ],
          };
        }),

      removeItem: (variantId) =>
        set((state) => ({
          ...state,
          items: state.items.filter(
            (item) => item.variantId !== variantId,
          ),
        })),

      incrementItem: (variantId) =>
        set((state) => ({
          ...state,
          items: state.items.map((item) => {
            if (item.variantId !== variantId) {
              return item;
            }

            return {
              ...item,
              quantity: Math.min(
                item.quantity + 1,
                item.stockQuantity,
              ),
            };
          }),
        })),

      decrementItem: (variantId) =>
        set((state) => {
          const targetItem = state.items.find(
            (item) => item.variantId === variantId,
          );

          if (!targetItem) {
            return state;
          }

          if (targetItem.quantity <= 1) {
            return {
              ...state,
              items: state.items.filter(
                (item) => item.variantId !== variantId,
              ),
            };
          }

          return {
            ...state,
            items: state.items.map((item) => {
              if (item.variantId !== variantId) {
                return item;
              }

              return {
                ...item,
                quantity: item.quantity - 1,
              };
            }),
          };
        }),

      clearCart: () =>
        set((state) => ({
          ...state,
          items: [],
        })),

      openDrawer: () =>
        set((state) => ({
          ...state,
          isDrawerOpen: true,
        })),

      closeDrawer: () =>
        set((state) => ({
          ...state,
          isDrawerOpen: false,
        })),

      setHasHydrated: (value) =>
        set((state) => ({
          ...state,
          hasHydrated: value,
        })),
    }),
    {
      name: "bebek-hamile-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);