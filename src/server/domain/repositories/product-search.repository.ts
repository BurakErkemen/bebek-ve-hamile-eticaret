import type { CategoryCatalogProductEntity } from "@/server/domain/entities/category-catalog.entity";

export interface ProductSearchRepository {
  searchProducts(
    query: string,
    limit: number,
  ): Promise<CategoryCatalogProductEntity[]>;
}
