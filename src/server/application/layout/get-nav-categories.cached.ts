import { unstable_cache } from "next/cache";
import { prisma } from "@/server/infrastructure/database/prisma/prisma-client";

export type NavCategoryChild = { id: string; name: string; slug: string };
export type NavCategory = {
  id: string;
  name: string;
  slug: string;
  children: NavCategoryChild[];
};

export const getCachedNavCategories = unstable_cache(
  async (): Promise<NavCategory[]> => {
    const rows = await prisma.category.findMany({
      where: { isActive: true, parentId: null },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        slug: true,
        children: {
          where: { isActive: true },
          orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
          select: { id: true, name: true, slug: true },
        },
      },
    });
    return rows;
  },
  ["nav-categories"],
  { revalidate: 300, tags: ["categories"] },
);
