"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { CategoryCatalogSort } from "@/server/domain/repositories/category-catalog.repository";

type CategoryCatalogToolbarProps = {
  sort: CategoryCatalogSort;
  minPrice?: number;
  maxPrice?: number;
};

export function CategoryCatalogToolbar({ sort, minPrice, maxPrice }: CategoryCatalogToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [minInput, setMinInput] = useState(minPrice?.toString() ?? "");
  const [maxInput, setMaxInput] = useState(maxPrice?.toString() ?? "");

  useEffect(() => {
    setMinInput(minPrice?.toString() ?? "");
    setMaxInput(maxPrice?.toString() ?? "");
  }, [minPrice, maxPrice]);

  function updateSort(nextSort: CategoryCatalogSort) {
    const p = new URLSearchParams(searchParams.toString());
    if (nextSort === "default") p.delete("sort"); else p.set("sort", nextSort);
    router.replace(`${pathname}?${p.toString()}`, { scroll: false });
  }

  function applyPriceFilter() {
    const p = new URLSearchParams(searchParams.toString());
    const min = minInput.trim();
    const max = maxInput.trim();
    if (min) p.set("minPrice", min); else p.delete("minPrice");
    if (max) p.set("maxPrice", max); else p.delete("maxPrice");
    router.replace(`${pathname}?${p.toString()}`, { scroll: false });
  }

  function clearPriceFilter() {
    const p = new URLSearchParams(searchParams.toString());
    p.delete("minPrice");
    p.delete("maxPrice");
    router.replace(`${pathname}?${p.toString()}`, { scroll: false });
  }

  const hasPriceFilter = typeof minPrice === "number" || typeof maxPrice === "number";

  return (
    <div className="flex flex-wrap items-end justify-between gap-3 rounded-2xl border border-brand-border bg-brand-white px-4 py-3">

      {/* Fiyat aralığı */}
      <div className="flex flex-wrap items-end gap-2">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-brand-muted">
            Fiyat Aralığı
          </span>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              min="0"
              inputMode="numeric"
              value={minInput}
              onChange={(e) => setMinInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyPriceFilter()}
              placeholder="Min ₺"
              className="w-[88px] rounded-lg border border-brand-border bg-brand-surface px-3 py-2 text-sm text-brand-text outline-none transition focus:border-brand-primary"
            />
            <span className="text-sm text-brand-muted">—</span>
            <input
              type="number"
              min="0"
              inputMode="numeric"
              value={maxInput}
              onChange={(e) => setMaxInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyPriceFilter()}
              placeholder="Max ₺"
              className="w-[88px] rounded-lg border border-brand-border bg-brand-surface px-3 py-2 text-sm text-brand-text outline-none transition focus:border-brand-primary"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={applyPriceFilter}
          className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-primary-dark"
        >
          Uygula
        </button>

        {hasPriceFilter && (
          <button
            type="button"
            onClick={clearPriceFilter}
            className="rounded-lg border border-brand-border bg-brand-white px-4 py-2 text-sm font-semibold text-brand-text transition hover:bg-brand-secondary"
          >
            Temizle
          </button>
        )}
      </div>

      {/* Sıralama */}
      <div className="flex flex-col gap-1">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-brand-muted">
          Sıralama
        </span>
        <select
          value={sort}
          onChange={(e) => updateSort(e.target.value as CategoryCatalogSort)}
          className="rounded-lg border border-brand-border bg-brand-surface px-3 py-2 text-sm font-medium text-brand-text outline-none transition focus:border-brand-primary"
        >
          <option value="default">Önerilen</option>
          <option value="price-asc">Fiyat: Artan</option>
          <option value="price-desc">Fiyat: Azalan</option>
          <option value="newest">En yeni</option>
        </select>
      </div>

    </div>
  );
}
