import type { Metadata } from "next";
import { CategoryProductGrid } from "@/modules/category/components/category-product-grid";
import { SearchBar } from "@/modules/search/components/search-bar";
import { SearchProductsUseCase } from "@/server/application/catalog/search-products.use-case";
import { PrismaProductSearchRepository } from "@/server/infrastructure/database/repositories/prisma-product-search.repository";

type PageProps = {
  searchParams: Promise<{ q?: string | string[] }>;
};

function normalizeQuery(raw: string | string[] | undefined): string {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return (value ?? "").trim();
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const query = normalizeQuery((await searchParams).q);
  return {
    title: query ? `"${query}" için arama sonuçları` : "Arama",
  };
}

export default async function SearchPage({ searchParams }: PageProps) {
  const query = normalizeQuery((await searchParams).q);

  const products =
    query.length >= 2
      ? await new SearchProductsUseCase(
          new PrismaProductSearchRepository(),
        ).execute(query)
      : [];

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 md:py-10 lg:px-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold tracking-tight text-brand-text md:text-3xl">
          {query ? `"${query}" için sonuçlar` : "Ürün ara"}
        </h1>
        {query && (
          <p className="mt-2 text-sm text-brand-muted">
            {products.length} ürün bulundu
          </p>
        )}
      </div>

      <div className="mb-8 max-w-md">
        <SearchBar initialQuery={query} />
      </div>

      {query.length < 2 ? (
        <p className="rounded-2xl border border-dashed border-brand-border bg-brand-white p-10 text-center text-sm text-brand-muted">
          Aramak için en az 2 karakter girin.
        </p>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-brand-border bg-brand-white p-10 text-center">
          <p className="font-semibold text-brand-text">
            &quot;{query}&quot; için ürün bulunamadı.
          </p>
          <p className="mt-1 text-sm text-brand-muted">
            Farklı bir kelimeyle aramayı deneyebilirsiniz.
          </p>
        </div>
      ) : (
        <CategoryProductGrid products={products} />
      )}
    </main>
  );
}
