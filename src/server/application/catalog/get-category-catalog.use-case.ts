import type { CategoryCatalogEntity } from "@/server/domain/entities/category-catalog.entity";
import type {
  CategoryCatalogQuery,
  CategoryCatalogRepository,
} from "@/server/domain/repositories/category-catalog.repository";

export class GetCategoryCatalogUseCase {
  constructor(
    private readonly categoryCatalogRepository: CategoryCatalogRepository,
  ) {}

  async execute(
    slug: string,
    query: CategoryCatalogQuery,
  ): Promise<CategoryCatalogEntity | null> {
    return this.categoryCatalogRepository.findCategoryCatalogBySlug(
      slug,
      query,
    );
  }
}