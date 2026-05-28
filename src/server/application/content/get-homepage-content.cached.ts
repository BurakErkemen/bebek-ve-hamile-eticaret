import { unstable_cache } from "next/cache";
import { GetHomepageContentUseCase } from "./get-homepage-content.use-case";
import { PrismaHomepageContentRepository } from "@/server/infrastructure/database/repositories/prisma-homepage-content.repository";

export const getCachedHomepageContent = unstable_cache(
  async () => {
    const useCase = new GetHomepageContentUseCase(
      new PrismaHomepageContentRepository(),
    );
    return useCase.execute();
  },
  ["homepage-content"],
  { revalidate: 300, tags: ["homepage"] },
);
