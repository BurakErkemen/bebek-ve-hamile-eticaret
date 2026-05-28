import { unstable_cache } from "next/cache";
import { GetCategoryCatalogUseCase } from "./get-category-catalog.use-case";
import { PrismaCategoryCatalogRepository } from "@/server/infrastructure/database/repositories/prisma-category-catalog.repository";
import type { CategoryCatalogQuery } from "@/server/domain/repositories/category-catalog.repository";

export const getCachedCategoryCatalog = unstable_cache(
  async (slug: string, query: CategoryCatalogQuery) => {
    const useCase = new GetCategoryCatalogUseCase(
      new PrismaCategoryCatalogRepository(),
    );
    return useCase.execute(slug, query);
  },
  ["category-catalog"],
  { revalidate: 300, tags: ["categories", "products"] },
);
