import type { CategoryCatalogEntity } from "@/server/domain/entities/category-catalog.entity";

export interface CategoryCatalogRepository {
  findCategoryCatalogBySlug(
    slug: string,
  ): Promise<CategoryCatalogEntity | null>;
}