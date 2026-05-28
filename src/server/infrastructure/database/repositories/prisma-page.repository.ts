import { prisma } from "@/server/infrastructure/database/prisma/prisma-client";
import type { PageRepository } from "@/server/domain/repositories/page.repository";
import type { PageDetail, PageInput, CorporatePageStatus } from "@/server/domain/entities/page.entity";

export class PrismaPageRepository implements PageRepository {
  async findPageBySlug(slug: string): Promise<PageDetail | null> {
    return prisma.page.findUnique({ where: { slug, isActive: true } });
  }

  async findPageBySlugAdmin(slug: string): Promise<PageDetail | null> {
    return prisma.page.findUnique({ where: { slug } });
  }

  async upsertPageBySlug(slug: string, input: PageInput): Promise<void> {
    await prisma.page.upsert({
      where: { slug },
      create: { ...input, slug },
      update: {
        title: input.title,
        content: input.content,
        isActive: input.isActive,
        sortOrder: input.sortOrder,
      },
    });
  }

  async getCorporatePageStatuses(slugs: string[]): Promise<CorporatePageStatus[]> {
    const rows = await prisma.page.findMany({
      where: { slug: { in: slugs } },
      select: { slug: true, isActive: true, content: true },
    });
    return rows.map((r) => ({
      slug: r.slug,
      isActive: r.isActive,
      hasContent: r.content.trim().length > 0,
    }));
  }
}
