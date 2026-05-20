"use client";

import { useMemo, useState } from "react";
import { useCartStore } from "@/modules/cart/store/cart.store";

type ProductVariant = {
  id: string;
  sku: string;
  size?: string;
  colorName?: string;
  colorHex?: string;
  price?: number;
  compareAtPrice?: number;
  stockQuantity: number;
  isInStock: boolean;
};

type ProductPurchasePanelProps = {
  productId: string;
  productSlug: string;
  productName: string;
  categoryLabel: string;
  imageUrl?: string | null;
  imageAlt?: string;

  basePrice: number;
  compareAtPrice?: number;
  variants: ProductVariant[];
  isFeatured: boolean;
};

const currencyFormatter = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
});

function buildVariantLabel(variant: ProductVariant): string {
  const labelParts = [variant.size, variant.colorName].filter(Boolean);

  if (labelParts.length === 0) {
    return variant.sku;
  }

  return labelParts.join(" / ");
}

export function ProductPurchasePanel({
  productId,
  productSlug,
  productName,
  categoryLabel,
  imageUrl,
  imageAlt,
  basePrice,
  compareAtPrice,
  variants,
  isFeatured,
}: ProductPurchasePanelProps) {
  const addItem = useCartStore((state) => state.addItem);
  const openDrawer = useCartStore((state) => state.openDrawer);

  const initialVariant =
    variants.find((variant) => variant.isInStock) ?? variants[0];

  const [selectedVariantId, setSelectedVariantId] = useState(
    initialVariant?.id ?? "",
  );

  const [feedbackMessage, setFeedbackMessage] = useState("");

  const selectedVariant = useMemo(() => {
    return (
      variants.find((variant) => variant.id === selectedVariantId) ??
      initialVariant
    );
  }, [variants, selectedVariantId, initialVariant]);

  const currentPrice = selectedVariant?.price ?? basePrice;
  const currentCompareAtPrice =
    selectedVariant?.compareAtPrice ?? compareAtPrice;

  const isInStock = selectedVariant
    ? selectedVariant.isInStock
    : false;

  function handleAddToCart() {
    if (!selectedVariant || !selectedVariant.isInStock) {
      return;
    }

    addItem({
      productId,
      variantId: selectedVariant.id,
      sku: selectedVariant.sku,
      productName,
      productSlug,
      categoryLabel,
      imageUrl,
      imageAlt,
      variantLabel: buildVariantLabel(selectedVariant),
      unitPrice: currentPrice,
      compareAtPrice: currentCompareAtPrice,
      stockQuantity: selectedVariant.stockQuantity,
      quantity: 1,
    });

    setFeedbackMessage("Ürün sepete eklendi.");
    openDrawer();
  }

  return (
    <section className="rounded-[var(--radius-brand-xl)] border border-brand-border bg-brand-white p-6 md:p-8">
      <div className="flex flex-wrap items-center gap-2">
        {isFeatured ? (
          <span className="rounded-full bg-brand-primary/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-brand-primary-dark">
            Öne Çıkan
          </span>
        ) : null}

        <span
          className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] ${
            isInStock
              ? "bg-brand-accent/35 text-[#4f7761]"
              : "bg-red-100 text-red-700"
          }`}
        >
          {isInStock ? "Stokta" : "Stokta Yok"}
        </span>
      </div>

      <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-brand-text md:text-4xl">
        {productName}
      </h1>

      <div className="mt-6 flex flex-wrap items-end gap-3">
        <span className="text-3xl font-bold text-brand-text">
          {currencyFormatter.format(currentPrice)}
        </span>

        {currentCompareAtPrice ? (
          <span className="text-lg font-medium text-brand-muted line-through">
            {currencyFormatter.format(currentCompareAtPrice)}
          </span>
        ) : null}
      </div>

      {variants.length > 0 ? (
        <div className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-muted">
            Varyant Seçimi
          </h2>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {variants.map((variant) => {
              const isSelected = variant.id === selectedVariant?.id;

              return (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => setSelectedVariantId(variant.id)}
                  className={`rounded-2xl border p-4 text-left transition ${
                    isSelected
                      ? "border-brand-primary bg-brand-secondary ring-2 ring-brand-primary/20"
                      : "border-brand-border bg-brand-surface hover:border-brand-primary/60"
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
        </div>
      ) : null}

      <div className="mt-8 grid gap-3 sm:grid-cols-[1fr_auto]">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!isInStock}
          className="rounded-full bg-brand-primary px-6 py-4 font-semibold text-white transition hover:bg-brand-primary-dark disabled:cursor-not-allowed disabled:bg-brand-muted"
        >
          Sepete Ekle
        </button>

        <button
          type="button"
          disabled={!isInStock}
          className="rounded-full border border-brand-border bg-brand-secondary px-6 py-4 font-semibold text-brand-text transition hover:bg-brand-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Hızlı Ödeme
        </button>
      </div>

      {feedbackMessage ? (
        <p className="mt-4 rounded-2xl bg-brand-accent/25 px-4 py-3 text-sm font-semibold text-[#4f7761]">
          {feedbackMessage}
        </p>
      ) : null}
    </section>
  );
}