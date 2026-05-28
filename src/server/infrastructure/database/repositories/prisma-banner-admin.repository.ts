import { prisma } from "../prisma/prisma-client";
import type { BannerAdminRepository } from "@/server/domain/repositories/banner-admin.repository";
import type {
  BannerAdminListItem,
  BannerAdminDetail,
  BannerAdminInput,
  BannerPlacement,
  VisualTone,
} from "@/server/domain/entities/banner-admin.entity";

export class PrismaBannerAdminRepository implements BannerAdminRepository {
  async listBanners(): Promise<BannerAdminListItem[]> {
    const rows = await prisma.banner.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
    return rows.map((b) => ({
      id: b.id,
      name: b.name,
      placement: b.placement as BannerPlacement,
      title: b.title,
      isActive: b.isActive,
      sortOrder: b.sortOrder,
    }));
  }

  async findBannerById(id: string): Promise<BannerAdminDetail | null> {
    const b = await prisma.banner.findUnique({ where: { id } });
    if (!b) return null;
    return {
      id: b.id,
      name: b.name,
      placement: b.placement as BannerPlacement,
      eyebrow: b.eyebrow,
      title: b.title,
      description: b.description,
      actionLabel: b.actionLabel,
      actionHref: b.actionHref,
      imageUrl: b.imageUrl,
      imageAlt: b.imageAlt,
      tone: b.tone as VisualTone,
      isActive: b.isActive,
      sortOrder: b.sortOrder,
    };
  }

  async createBanner(input: BannerAdminInput): Promise<{ id: string }> {
    const b = await prisma.banner.create({
      data: {
        name: input.name,
        placement: input.placement,
        eyebrow: input.eyebrow ?? null,
        title: input.title,
        description: input.description ?? null,
        actionLabel: input.actionLabel ?? null,
        actionHref: input.actionHref ?? null,
        imageUrl: input.imageUrl ?? null,
        imageAlt: input.imageAlt ?? null,
        tone: input.tone,
        isActive: input.isActive,
        sortOrder: input.sortOrder,
      },
    });
    return { id: b.id };
  }

  async updateBanner(id: string, input: BannerAdminInput): Promise<void> {
    await prisma.banner.update({
      where: { id },
      data: {
        name: input.name,
        placement: input.placement,
        eyebrow: input.eyebrow ?? null,
        title: input.title,
        description: input.description ?? null,
        actionLabel: input.actionLabel ?? null,
        actionHref: input.actionHref ?? null,
        imageUrl: input.imageUrl ?? null,
        imageAlt: input.imageAlt ?? null,
        tone: input.tone,
        isActive: input.isActive,
        sortOrder: input.sortOrder,
      },
    });
  }

  async deleteBanner(id: string): Promise<void> {
    await prisma.banner.delete({ where: { id } });
  }
}
