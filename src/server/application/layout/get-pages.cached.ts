import { unstable_cache } from "next/cache";
import { prisma } from "@/server/infrastructure/database/prisma/prisma-client";
import { CORPORATE_PAGE_SLUGS } from "@/server/domain/entities/corporate-pages";

export type CorporatePageStatusMap = Record<string, { isActive: boolean; hasContent: boolean }>;

export const getCachedCorporatePageStatuses = unstable_cache(
  async (): Promise<CorporatePageStatusMap> => {
    const rows = await prisma.page.findMany({
      where: { slug: { in: CORPORATE_PAGE_SLUGS } },
      select: { slug: true, isActive: true, content: true },
    });
    return Object.fromEntries(
      rows.map((r) => [r.slug, { isActive: r.isActive, hasContent: r.content.trim().length > 0 }]),
    );
  },
  ["corporate-page-statuses"],
  { revalidate: 300, tags: ["pages"] },
);
