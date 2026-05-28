import type { CategoryCatalogProductEntity } from "@/server/domain/entities/category-catalog.entity";
import type { ProductSearchRepository } from "@/server/domain/repositories/product-search.repository";

const DEFAULT_LIMIT = 48;
const MIN_QUERY_LENGTH = 2;

export class SearchProductsUseCase {
  constructor(
    private readonly productSearchRepository: ProductSearchRepository,
  ) {}

  async execute(
    rawQuery: string,
    limit: number = DEFAULT_LIMIT,
  ): Promise<CategoryCatalogProductEntity[]> {
    const query = rawQuery.trim();

    if (query.length < MIN_QUERY_LENGTH) {
      return [];
    }

    return this.productSearchRepository.searchProducts(query, limit);
  }
}
