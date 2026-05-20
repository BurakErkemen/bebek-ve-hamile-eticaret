"use client";

import { useEffect, useMemo, useState } from "react";
import { useCartStore } from "@/modules/cart/store/cart.store";
import type { ProductCardItem, ProductCardVariant } from "@/modules/product/types/product-card.types";

type ProductQuickAddProps = {
  product: ProductCardItem;
};

function buildVariantLabel(variant: ProductCardVariant): string {
  const parts = [variant.size, variant.colorName].filter(Boolean);

  if (parts.length === 0) {
    return variant.sku;
  }

  return parts.join(" / ");
}

export function ProductQuickAdd({ product }: ProductQuickAddProps) {
  const addItem = useCartStore((state) => state.addItem);
  const openDrawer = useCartStore((state) => state.openDrawer);

  const variants = product.variants ?? [];
  const inStockVariants = variants.filter((variant) => variant.isInStock);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState(
    inStockVariants[0]?.id ?? "",
  );

  useEffect(() => {
    if (!isDialogOpen) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsDialogOpen(false);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isDialogOpen]);

  const selectedVariant = useMemo(() => {
    return (
      inStockVariants.find((variant) => variant.id === selectedVariantId) ??
      inStockVariants[0]
    );
  }, [inStockVariants, selectedVariantId]);

  function addVariantToCart(variant: ProductCardVariant) {
    const unitPrice = variant.price ?? product.price;
    const compareAtPrice =
      variant.compareAtPrice ?? product.compareAtPrice;

    addItem({
      productId: product.id,
      variantId: variant.id,
      sku: variant.sku,
      productName: product.name,
      productSlug: product.slug,
      categoryLabel: product.categoryLabel,
      imageUrl: product.imageUrl,
      imageAlt: product.imageAlt,
      variantLabel: buildVariantLabel(variant),
      unitPrice,
      compareAtPrice,
      quantity: 1,
      stockQuantity: variant.stockQuantity,
    });

    setIsDialogOpen(false);
    openDrawer();
  }

  function handleQuickAddClick() {
    if (inStockVariants.length === 0) {
      return;
    }

    if (inStockVariants.length === 1) {
      addVariantToCart(inStockVariants[0]);
      return;
    }

    setSelectedVariantId(inStockVariants[0].id);
    setIsDialogOpen(true);
  }

  const buttonLabel =
    inStockVariants.length === 0
      ? "Stokta Yok"
      : inStockVariants.length === 1
        ? "Sepete Ekle"
        : "Varyant Seç";

  return (
    <>
      <button
        type="button"
        onClick={handleQuickAddClick}
        disabled={inStockVariants.length === 0}
        className="w-full rounded-full bg-brand-secondary px-4 py-3 text-sm font-semibold text-brand-text transition hover:bg-brand-primary hover:text-white disabled:cursor-not-allowed disabled:bg-brand-muted/20 disabled:text-brand-muted"
      >
        {buttonLabel}
      </button>

      {isDialogOpen ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Varyant seçimini kapat"
            onClick={() => setIsDialogOpen(false)}
            className="absolute inset-0 bg-black/40"
          />

          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby={`quick-add-title-${product.id}`}
            className="relative z-10 w-full max-w-lg rounded-[var(--radius-brand-xl)] border border-brand-border bg-brand-white p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-display text-sm font-bold uppercase tracking-[0.16em] text-brand-primary-dark">
                  Hızlı Sepete Ekle
                </p>

                <h2
                  id={`quick-add-title-${product.id}`}
                  className="mt-3 font-display text-2xl font-bold leading-8 text-brand-text"
                >
                  {product.name}
                </h2>

                <p className="mt-2 text-sm leading-6 text-brand-muted">
                  Sepete eklemek istediğiniz varyantı seçin.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsDialogOpen(false)}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-border bg-brand-surface text-xl font-bold text-brand-text transition hover:bg-brand-secondary"
              >
                ×
              </button>
            </div>

            <div className="mt-6 space-y-3">
              {variants.map((variant) => {
                const isSelected = variant.id === selectedVariant?.id;
                const isDisabled = !variant.isInStock;

                return (
                  <button
                    key={variant.id}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => setSelectedVariantId(variant.id)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      isSelected
                        ? "border-brand-primary bg-brand-secondary ring-2 ring-brand-primary/20"
                        : "border-brand-border bg-brand-surface hover:border-brand-primary/60"
                    } ${
                      isDisabled
                        ? "cursor-not-allowed opacity-50"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {variant.colorHex ? (
                        <span
                          className="h-5 w-5 rounded-full border border-brand-border"
                          style={{
                            backgroundColor: variant.colorHex,
                          }}
                        />
                      ) : null}

                      <span className="text-sm font-bold text-brand-text">
                        {buildVariantLabel(variant)}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                      <span className="text-brand-muted">
                        SKU: {variant.sku}
                      </span>

                      <span
                        className={
                          variant.isInStock
                            ? "font-semibold text-[#4f7761]"
                            : "font-semibold text-red-700"
                        }
                      >
                        {variant.isInStock
                          ? `${variant.stockQuantity} adet`
                          : "Tükendi"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              disabled={!selectedVariant}
              onClick={() => {
                if (selectedVariant) {
                  addVariantToCart(selectedVariant);
                }
              }}
              className="mt-6 w-full rounded-full bg-brand-primary px-6 py-4 font-semibold text-white transition hover:bg-brand-primary-dark disabled:cursor-not-allowed disabled:bg-brand-muted"
            >
              Seçili Varyantı Sepete Ekle
            </button>
          </section>
        </div>
      ) : null}
    </>
  );
}
