"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { CategoryCatalogSort } from "@/server/domain/repositories/category-catalog.repository";

type CategoryCatalogToolbarProps = {
  sort: CategoryCatalogSort;
  minPrice?: number;
  maxPrice?: number;
};

export function CategoryCatalogToolbar({
  sort,
  minPrice,
  maxPrice,
}: CategoryCatalogToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [minimumPriceInput, setMinimumPriceInput] = useState(
    minPrice?.toString() ?? "",
  );

  const [maximumPriceInput, setMaximumPriceInput] = useState(
    maxPrice?.toString() ?? "",
  );

  useEffect(() => {
    setMinimumPriceInput(minPrice?.toString() ?? "");
    setMaximumPriceInput(maxPrice?.toString() ?? "");
  }, [minPrice, maxPrice]);

  function updateSort(nextSort: CategoryCatalogSort) {
    const nextParams = new URLSearchParams(searchParams.toString());

    if (nextSort === "default") {
      nextParams.delete("sort");
    } else {
      nextParams.set("sort", nextSort);
    }

    router.replace(`${pathname}?${nextParams.toString()}`, {
      scroll: false,
    });
  }

  function applyPriceFilter() {
    const nextParams = new URLSearchParams(searchParams.toString());

    const normalizedMinPrice = minimumPriceInput.trim();
    const normalizedMaxPrice = maximumPriceInput.trim();

    if (normalizedMinPrice) {
      nextParams.set("minPrice", normalizedMinPrice);
    } else {
      nextParams.delete("minPrice");
    }

    if (normalizedMaxPrice) {
      nextParams.set("maxPrice", normalizedMaxPrice);
    } else {
      nextParams.delete("maxPrice");
    }

    router.replace(`${pathname}?${nextParams.toString()}`, {
      scroll: false,
    });
  }

  function clearPriceFilter() {
    const nextParams = new URLSearchParams(searchParams.toString());

    nextParams.delete("minPrice");
    nextParams.delete("maxPrice");

    router.replace(`${pathname}?${nextParams.toString()}`, {
      scroll: false,
    });
  }

  const hasPriceFilter =
    typeof minPrice === "number" || typeof maxPrice === "number";

  return (
    <section className="rounded-[var(--radius-brand-lg)] border border-brand-border bg-brand-white p-5">
      <div className="grid gap-5 xl:grid-cols-[1fr_auto] xl:items-end">
        <div>
          <h2 className="font-display text-lg font-bold text-brand-text">
            Fiyat Aralığı
          </h2>

          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto_auto]">
            <label className="space-y-2">
              <span className="text-sm font-medium text-brand-muted">
                Minimum
              </span>

              <input
                type="number"
                min="0"
                inputMode="numeric"
                value={minimumPriceInput}
                onChange={(event) =>
                  setMinimumPriceInput(event.target.value)
                }
                placeholder="0"
                className="w-full rounded-2xl border border-brand-border bg-brand-surface px-4 py-3 text-sm text-brand-text outline-none transition focus:border-brand-primary"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-brand-muted">
                Maksimum
              </span>

              <input
                type="number"
                min="0"
                inputMode="numeric"
                value={maximumPriceInput}
                onChange={(event) =>
                  setMaximumPriceInput(event.target.value)
                }
                placeholder="2500"
                className="w-full rounded-2xl border border-brand-border bg-brand-surface px-4 py-3 text-sm text-brand-text outline-none transition focus:border-brand-primary"
              />
            </label>

            <button
              type="button"
              onClick={applyPriceFilter}
              className="mt-auto rounded-2xl bg-brand-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-primary-dark"
            >
              Uygula
            </button>

            {hasPriceFilter ? (
              <button
                type="button"
                onClick={clearPriceFilter}
                className="mt-auto rounded-2xl border border-brand-border bg-brand-white px-5 py-3 text-sm font-semibold text-brand-text transition hover:bg-brand-secondary"
              >
                Temizle
              </button>
            ) : null}
          </div>
        </div>

        <label className="space-y-2">
          <span className="text-sm font-medium text-brand-muted">
            Sıralama
          </span>

          <select
            value={sort}
            onChange={(event) =>
              updateSort(event.target.value as CategoryCatalogSort)
            }
            className="w-full min-w-56 rounded-2xl border border-brand-border bg-brand-surface px-4 py-3 text-sm font-medium text-brand-text outline-none transition focus:border-brand-primary"
          >
            <option value="default">Önerilen sıralama</option>
            <option value="price-asc">Fiyat: Artan</option>
            <option value="price-desc">Fiyat: Azalan</option>
            <option value="newest">En yeni</option>
          </select>
        </label>
      </div>
    </section>
  );
}