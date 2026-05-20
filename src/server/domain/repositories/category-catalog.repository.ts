import type { CategoryCatalogEntity } from "@/server/domain/entities/category-catalog.entity";

export type CategoryCatalogFilters = Record<string, string[]>;

export type CategoryCatalogSort =
  | "default"
  | "price-asc"
  | "price-desc"
  | "newest";

export type CategoryCatalogQuery = {
  attributeFilters: CategoryCatalogFilters;
  minPrice?: number;
  maxPrice?: number;
  sort: CategoryCatalogSort;
};

export interface CategoryCatalogRepository {
  findCategoryCatalogBySlug(
    slug: string,
    query: CategoryCatalogQuery,
  ): Promise<CategoryCatalogEntity | null>;
}