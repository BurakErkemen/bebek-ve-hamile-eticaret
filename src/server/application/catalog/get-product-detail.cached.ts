import { unstable_cache } from "next/cache";
import { GetProductDetailUseCase } from "./get-product-detail.use-case";
import { PrismaProductDetailRepository } from "@/server/infrastructure/database/repositories/prisma-product-detail.repository";

export const getCachedProductDetail = unstable_cache(
  async (slug: string) => {
    const useCase = new GetProductDetailUseCase(
      new PrismaProductDetailRepository(),
    );
    return useCase.execute(slug);
  },
  ["product-detail"],
  { revalidate: 300, tags: ["products"] },
);
