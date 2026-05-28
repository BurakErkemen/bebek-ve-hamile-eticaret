import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryActiveFilters } from "@/modules/category/components/category-active-filters";
import { CategoryBreadcrumb } from "@/modules/category/components/category-breadcrumb";
import { CategoryCatalogToolbar } from "@/modules/category/components/category-catalog-toolbar";
import { CategoryFilterPanel } from "@/modules/category/components/category-filter-panel";
import { CategoryHeader } from "@/modules/category/components/category-header";
import { CategoryProductGrid } from "@/modules/category/components/category-product-grid";
import { GetCategoryCatalogUseCase } from "@/server/application/catalog/get-category-catalog.use-case";
import type {
  CategoryCatalogQuery,
  CategoryCatalogSort,
} from "@/server/domain/repositories/category-catalog.repository";
import { PrismaCategoryCatalogRepository } from "@/server/infrastructure/database/repositories/prisma-category-catalog.repository";

type RawSearchParams = Promise<{
  [key: string]: string | string[] | undefined;
}>;

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: RawSearchParams;
};

const reservedQueryKeys = new Set([
  "minPrice",
  "maxPrice",
  "sort",
]);

const allowedSortValues: CategoryCatalogSort[] = [
  "default",
  "price-asc",
  "price-desc",
  "newest",
];

function parseOptionalPositiveNumber(
  rawValue: string | string[] | undefined,
): number | undefined {
  const normalizedValue = Array.isArray(rawValue)
    ? rawValue[0]
    : rawValue;

  if (!normalizedValue) {
    return undefined;
  }

  const parsedValue = Number(normalizedValue);

  if (!Number.isFinite(parsedValue) || parsedValue < 0) {
    return undefined;
  }

  return parsedValue;
}

function parseSort(
  rawValue: string | string[] | undefined,
): CategoryCatalogSort {
  const normalizedValue = Array.isArray(rawValue)
    ? rawValue[0]
    : rawValue;

  if (
    normalizedValue &&
    allowedSortValues.includes(normalizedValue as CategoryCatalogSort)
  ) {
    return normalizedValue as CategoryCatalogSort;
  }

  return "default";
}

function parseSearchParamsIntoQuery(
  rawSearchParams: Awaited<RawSearchParams>,
): CategoryCatalogQuery {
  const attributeFilters: Record<string, string[]> = {};

  for (const [key, rawValue] of Object.entries(rawSearchParams)) {
    if (!rawValue || reservedQueryKeys.has(key)) {
      continue;
    }

    const values = Array.isArray(rawValue)
      ? rawValue.flatMap((value) => value.split(","))
      : rawValue.split(",");

    const normalizedValues = values
      .map((value) => value.trim())
      .filter(Boolean);

    if (normalizedValues.length > 0) {
      attributeFilters[key] = Array.from(new Set(normalizedValues));
    }
  }

  return {
    attributeFilters,
    minPrice: parseOptionalPositiveNumber(rawSearchParams.minPrice),
    maxPrice: parseOptionalPositiveNumber(rawSearchParams.maxPrice),
    sort: parseSort(rawSearchParams.sort),
  };
}

async function getCategoryCatalog(
  slug: string,
  rawSearchParams: Awaited<RawSearchParams>,
) {
  const categoryCatalogRepository =
    new PrismaCategoryCatalogRepository();

  const getCategoryCatalogUseCase =
    new GetCategoryCatalogUseCase(categoryCatalogRepository);

  const query = parseSearchParamsIntoQuery(rawSearchParams);

  const category = await getCategoryCatalogUseCase.execute(slug, query);

  return {
    category,
    query,
  };
}

export async function generateMetadata({
  params,
  searchParams,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const { category } = await getCategoryCatalog(
    slug,
    resolvedSearchParams,
  );

  if (!category) {
    return {
      title: "Kategori Bulunamadı",
    };
  }

  return {
    title: category.name,
    description:
      category.description ??
      `${category.name} kategorisindeki ürünleri inceleyin.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  const { category, query } = await getCategoryCatalog(
    slug,
    resolvedSearchParams,
  );

  if (!category) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 md:py-10 lg:px-8">
      <CategoryBreadcrumb categoryName={category.name} />

      <CategoryHeader
        name={category.name}
        description={category.description}
        productCount={category.products.length}
      />

      {(() => {
        const hasFilters = category.filters.length > 0;
        return (
          <section className={`mt-8 ${hasFilters ? "grid gap-6 lg:grid-cols-[280px_1fr]" : ""}`}>
            {hasFilters && <CategoryFilterPanel filters={category.filters} />}

            <div className="space-y-4">
              <CategoryCatalogToolbar
                sort={query.sort}
                minPrice={query.minPrice}
                maxPrice={query.maxPrice}
              />

              <CategoryActiveFilters
                filters={category.filters}
                minPrice={query.minPrice}
                maxPrice={query.maxPrice}
              />

              <CategoryProductGrid products={category.products} hasSidebar={hasFilters} />
            </div>
          </section>
        );
      })()}
    </main>
  );
}