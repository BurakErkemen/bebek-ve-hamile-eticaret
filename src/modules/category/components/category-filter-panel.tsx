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

type CategoryFilterPanelProps = {
  filters: CategoryFilterGroup[];
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

export function CategoryFilterPanel({
  filters,
}: CategoryFilterPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateFilterValue(
    filterSlug: string,
    valueSlug: string,
    shouldSelect: boolean,
  ) {
    const nextParams = new URLSearchParams(searchParams.toString());

    const existingValues = parseCurrentValueList(
      nextParams.get(filterSlug),
    );

    const nextValues = shouldSelect
      ? Array.from(new Set([...existingValues, valueSlug]))
      : existingValues.filter((value) => value !== valueSlug);

    if (nextValues.length > 0) {
      nextParams.set(filterSlug, nextValues.join(","));
    } else {
      nextParams.delete(filterSlug);
    }

    router.replace(`${pathname}?${nextParams.toString()}`, {
      scroll: false,
    });
  }

  function clearAttributeFilters() {
    const nextParams = new URLSearchParams(searchParams.toString());

    filters.forEach((filter) => {
      nextParams.delete(filter.slug);
    });

    router.replace(`${pathname}?${nextParams.toString()}`, {
      scroll: false,
    });
  }

  const hasAnySelectedFilter = filters.some((filter) =>
    filter.values.some((value) => value.isSelected),
  );

  if (filters.length === 0) {
    return null;
  }

  return (
    <aside className="rounded-[var(--radius-brand-lg)] border border-brand-border bg-brand-white p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-lg font-bold text-brand-text">
          Filtreler
        </h2>

        {hasAnySelectedFilter ? (
          <button
            type="button"
            onClick={clearAttributeFilters}
            className="text-sm font-semibold text-brand-primary-dark transition hover:opacity-75"
          >
            Temizle
          </button>
        ) : null}
      </div>

      <div className="mt-5 space-y-6">
        {filters.map((filter) => (
          <section key={filter.id}>
            <h3 className="font-display text-sm font-bold uppercase tracking-[0.14em] text-brand-muted">
              {filter.name}
            </h3>

            <div className="mt-3 space-y-2">
              {filter.values.map((value) => {
                if (filter.displayType === "COLOR_SWATCH") {
                  return (
                    <label
                      key={value.id}
                      className="flex cursor-pointer items-center gap-3 rounded-2xl border border-brand-border px-3 py-2 transition hover:bg-brand-secondary/60"
                    >
                      <input
                        type="checkbox"
                        checked={value.isSelected}
                        onChange={(event) =>
                          updateFilterValue(
                            filter.slug,
                            value.slug,
                            event.target.checked,
                          )
                        }
                        className="h-4 w-4 accent-[#d9899d]"
                      />

                      <span
                        className="h-5 w-5 rounded-full border border-brand-border"
                        style={{
                          backgroundColor: value.colorHex ?? "#ffffff",
                        }}
                      />

                      <span className="text-sm font-medium text-brand-text">
                        {value.value}
                      </span>
                    </label>
                  );
                }

                return (
                  <label
                    key={value.id}
                    className="flex cursor-pointer items-center gap-3 rounded-2xl border border-brand-border px-3 py-2 transition hover:bg-brand-secondary/60"
                  >
                    <input
                      type="checkbox"
                      checked={value.isSelected}
                      onChange={(event) =>
                        updateFilterValue(
                          filter.slug,
                          value.slug,
                          event.target.checked,
                        )
                      }
                      className="h-4 w-4 accent-[#d9899d]"
                    />

                    <span className="text-sm font-medium text-brand-text">
                      {value.value}
                    </span>
                  </label>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </aside>
  );
}