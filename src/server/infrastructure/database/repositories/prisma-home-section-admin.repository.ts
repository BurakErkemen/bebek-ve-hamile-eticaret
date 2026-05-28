import { prisma } from "../prisma/prisma-client";
import type { HomeSectionAdminRepository } from "@/server/domain/repositories/home-section-admin.repository";
import type {
  HomeSectionAdminListItem,
  HomeSectionAdminDetail,
  HomeSectionAdminInput,
  HomeSectionItemAdminInput,
  HomeSectionType,
  HomeSectionItemType,
  VisualTone,
} from "@/server/domain/entities/home-section-admin.entity";

export class PrismaHomeSectionAdminRepository implements HomeSectionAdminRepository {
  async listHomeSections(): Promise<HomeSectionAdminListItem[]> {
    const rows = await prisma.homeSection.findMany({
      include: { _count: { select: { items: true } } },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    return rows.map((s) => ({
      id: s.id,
      type: s.type as HomeSectionType,
      title: s.title,
      isActive: s.isActive,
      sortOrder: s.sortOrder,
      itemCount: s._count.items,
    }));
  }

  async findHomeSectionById(id: string): Promise<HomeSectionAdminDetail | null> {
    const s = await prisma.homeSection.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            category: { select: { name: true } },
            product: { select: { name: true } },
          },
          orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        },
      },
    });
    if (!s) return null;
    return {
      id: s.id,
      type: s.type as HomeSectionType,
      eyebrow: s.eyebrow,
      title: s.title,
      description: s.description,
      actionLabel: s.actionLabel,
      actionHref: s.actionHref,
      sliderId: s.sliderId,
      bannerId: s.bannerId,
      isActive: s.isActive,
      sortOrder: s.sortOrder,
      items: s.items.map((item) => ({
        id: item.id,
        itemType: item.itemType as HomeSectionItemType,
        categoryId: item.categoryId,
        categoryName: item.category?.name ?? null,
        productId: item.productId,
        productName: item.product?.name ?? null,
        title: item.title,
        description: item.description,
        href: item.href,
        badge: item.badge,
        tone: item.tone as VisualTone,
        isActive: item.isActive,
        sortOrder: item.sortOrder,
      })),
    };
  }

  async createHomeSection(input: HomeSectionAdminInput): Promise<{ id: string }> {
    const s = await prisma.homeSection.create({
      data: {
        type: input.type,
        eyebrow: input.eyebrow ?? null,
        title: input.title ?? null,
        description: input.description ?? null,
        actionLabel: input.actionLabel ?? null,
        actionHref: input.actionHref ?? null,
        sliderId: input.sliderId ?? null,
        bannerId: input.bannerId ?? null,
        isActive: input.isActive,
        sortOrder: input.sortOrder,
      },
    });
    return { id: s.id };
  }

  async updateHomeSection(id: string, input: HomeSectionAdminInput): Promise<void> {
    await prisma.homeSection.update({
      where: { id },
      data: {
        type: input.type,
        eyebrow: input.eyebrow ?? null,
        title: input.title ?? null,
        description: input.description ?? null,
        actionLabel: input.actionLabel ?? null,
        actionHref: input.actionHref ?? null,
        sliderId: input.sliderId ?? null,
        bannerId: input.bannerId ?? null,
        isActive: input.isActive,
        sortOrder: input.sortOrder,
      },
    });
  }

  async deleteHomeSection(id: string): Promise<void> {
    await prisma.homeSection.delete({ where: { id } });
  }

  async createHomeSectionItem(sectionId: string, input: HomeSectionItemAdminInput): Promise<{ id: string }> {
    const item = await prisma.homeSectionItem.create({
      data: {
        sectionId,
        itemType: input.itemType,
        categoryId: input.categoryId ?? null,
        productId: input.productId ?? null,
        title: input.title ?? null,
        description: input.description ?? null,
        href: input.href ?? null,
        badge: input.badge ?? null,
        tone: input.tone,
        isActive: input.isActive,
        sortOrder: input.sortOrder,
      },
    });
    return { id: item.id };
  }

  async updateHomeSectionItem(id: string, input: HomeSectionItemAdminInput): Promise<void> {
    await prisma.homeSectionItem.update({
      where: { id },
      data: {
        itemType: input.itemType,
        categoryId: input.categoryId ?? null,
        productId: input.productId ?? null,
        title: input.title ?? null,
        description: input.description ?? null,
        href: input.href ?? null,
        badge: input.badge ?? null,
        tone: input.tone,
        isActive: input.isActive,
        sortOrder: input.sortOrder,
      },
    });
  }

  async deleteHomeSectionItem(id: string): Promise<void> {
    await prisma.homeSectionItem.delete({ where: { id } });
  }
}
