"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type CategoryFilterValue = {
  id: string;
  value: string;
  slug: string;
  colorHex?: string;
  isSelected: boolean;
};

type CategoryFilterGroup = {
  id: string;
  name: string;
  slug: string;
  displayType: "CHECKBOX" | "RADIO" | "COLOR_SWATCH" | "BADGE";
  values: CategoryFilterValue[];
};

type CategoryActiveFiltersProps = {
  filters: CategoryFilterGroup[];
  minPrice?: number;
  maxPrice?: number;
};

function parseCurrentValueList(rawValue: string | null): string[] {
  if (!rawValue) {
    return [];
  }

  return rawValue
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

const currencyFormatter = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 0,
});

export function CategoryActiveFilters({
  filters,
  minPrice,
  maxPrice,
}: CategoryActiveFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedAttributeValues = filters.flatMap((filter) =>
    filter.values
      .filter((value) => value.isSelected)
      .map((value) => ({
        filterSlug: filter.slug,
        filterName: filter.name,
        valueSlug: value.slug,
        valueLabel: value.value,
      })),
  );

  const hasPriceFilter =
    typeof minPrice === "number" || typeof maxPrice === "number";

  const hasAnyActiveFilter =
    selectedAttributeValues.length > 0 || hasPriceFilter;

  function removeAttributeFilterValue(
    filterSlug: string,
    valueSlug: string,
  ) {
    const nextParams = new URLSearchParams(searchParams.toString());

    const existingValues = parseCurrentValueList(
      nextParams.get(filterSlug),
    );

    const nextValues = existingValues.filter(
      (value) => value !== valueSlug,
    );

    if (nextValues.length > 0) {
      nextParams.set(filterSlug, nextValues.join(","));
    } else {
      nextParams.delete(filterSlug);
    }

    router.replace(`${pathname}?${nextParams.toString()}`, {
      scroll: false,
    });
  }

  function removePriceFilter() {
    const nextParams = new URLSearchParams(searchParams.toString());

    nextParams.delete("minPrice");
    nextParams.delete("maxPrice");

    router.replace(`${pathname}?${nextParams.toString()}`, {
      scroll: false,
    });
  }

  function clearAllFilters() {
    const nextParams = new URLSearchParams(searchParams.toString());

    filters.forEach((filter) => {
      nextParams.delete(filter.slug);
    });

    nextParams.delete("minPrice");
    nextParams.delete("maxPrice");

    router.replace(`${pathname}?${nextParams.toString()}`, {
      scroll: false,
    });
  }

  if (!hasAnyActiveFilter) {
    return null;
  }

  const priceLabel =
    typeof minPrice === "number" && typeof maxPrice === "number"
      ? `${currencyFormatter.format(minPrice)} - ${currencyFormatter.format(maxPrice)}`
      : typeof minPrice === "number"
        ? `${currencyFormatter.format(minPrice)} ve üzeri`
        : `${currencyFormatter.format(maxPrice ?? 0)} ve altı`;

  return (
    <section className="rounded-[var(--radius-brand-lg)] border border-brand-border bg-brand-white p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-base font-bold text-brand-text">
            Aktif Filtreler
          </h2>

          <div className="mt-3 flex flex-wrap gap-2">
            {selectedAttributeValues.map((selectedValue) => (
              <button
                key={`${selectedValue.filterSlug}-${selectedValue.valueSlug}`}
                type="button"
                onClick={() =>
                  removeAttributeFilterValue(
                    selectedValue.filterSlug,
                    selectedValue.valueSlug,
                  )
                }
                className="inline-flex items-center gap-2 rounded-full border border-brand-border bg-brand-secondary px-4 py-2 text-sm font-semibold text-brand-text transition hover:bg-brand-primary hover:text-white"
              >
                <span>
                  {selectedValue.filterName}: {selectedValue.valueLabel}
                </span>
                <span aria-hidden="true">×</span>
              </button>
            ))}

            {hasPriceFilter ? (
              <button
                type="button"
                onClick={removePriceFilter}
                className="inline-flex items-center gap-2 rounded-full border border-brand-border bg-brand-secondary px-4 py-2 text-sm font-semibold text-brand-text transition hover:bg-brand-primary hover:text-white"
              >
                <span>Fiyat: {priceLabel}</span>
                <span aria-hidden="true">×</span>
              </button>
            ) : null}
          </div>
        </div>

        <button
          type="button"
          onClick={clearAllFilters}
          className="inline-flex shrink-0 items-center justify-center rounded-full border border-brand-border bg-brand-white px-5 py-3 text-sm font-semibold text-brand-text transition hover:bg-brand-secondary"
        >
          Filtreleri Temizle
        </button>
      </div>
    </section>
  );
}