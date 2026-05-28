import { prisma } from "../prisma/prisma-client";
import type { SliderAdminRepository } from "@/server/domain/repositories/slider-admin.repository";
import type {
  SliderAdminListItem,
  SliderAdminDetail,
  SliderAdminInput,
  SliderSlideAdminInput,
  SliderPlacement,
  VisualTone,
} from "@/server/domain/entities/slider-admin.entity";

export class PrismaSliderAdminRepository implements SliderAdminRepository {
  async listSliders(): Promise<SliderAdminListItem[]> {
    const rows = await prisma.slider.findMany({
      include: { _count: { select: { slides: true } } },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
    return rows.map((s) => ({
      id: s.id,
      name: s.name,
      placement: s.placement as SliderPlacement,
      isActive: s.isActive,
      sortOrder: s.sortOrder,
      slideCount: s._count.slides,
    }));
  }

  async findSliderById(id: string): Promise<SliderAdminDetail | null> {
    const s = await prisma.slider.findUnique({
      where: { id },
      include: {
        slides: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] },
      },
    });
    if (!s) return null;
    return {
      id: s.id,
      name: s.name,
      placement: s.placement as SliderPlacement,
      isActive: s.isActive,
      sortOrder: s.sortOrder,
      slides: s.slides.map((sl) => ({
        id: sl.id,
        eyebrow: sl.eyebrow,
        title: sl.title,
        description: sl.description,
        primaryActionLabel: sl.primaryActionLabel,
        primaryActionHref: sl.primaryActionHref,
        secondaryActionLabel: sl.secondaryActionLabel,
        secondaryActionHref: sl.secondaryActionHref,
        imageUrl: sl.imageUrl,
        imageAlt: sl.imageAlt,
        tone: sl.tone as VisualTone,
        isActive: sl.isActive,
        sortOrder: sl.sortOrder,
      })),
    };
  }

  async createSlider(input: SliderAdminInput): Promise<{ id: string }> {
    const s = await prisma.slider.create({
      data: {
        name: input.name,
        placement: input.placement,
        isActive: input.isActive,
        sortOrder: input.sortOrder,
      },
    });
    return { id: s.id };
  }

  async updateSlider(id: string, input: SliderAdminInput): Promise<void> {
    await prisma.slider.update({
      where: { id },
      data: {
        name: input.name,
        placement: input.placement,
        isActive: input.isActive,
        sortOrder: input.sortOrder,
      },
    });
  }

  async deleteSlider(id: string): Promise<void> {
    await prisma.slider.delete({ where: { id } });
  }

  async createSlide(sliderId: string, input: SliderSlideAdminInput): Promise<{ id: string }> {
    const sl = await prisma.sliderSlide.create({
      data: {
        sliderId,
        eyebrow: input.eyebrow ?? null,
        title: input.title,
        description: input.description ?? null,
        primaryActionLabel: input.primaryActionLabel ?? null,
        primaryActionHref: input.primaryActionHref ?? null,
        secondaryActionLabel: input.secondaryActionLabel ?? null,
        secondaryActionHref: input.secondaryActionHref ?? null,
        imageUrl: input.imageUrl ?? null,
        imageAlt: input.imageAlt ?? null,
        tone: input.tone,
        isActive: input.isActive,
        sortOrder: input.sortOrder,
      },
    });
    return { id: sl.id };
  }

  async updateSlide(id: string, input: SliderSlideAdminInput): Promise<void> {
    await prisma.sliderSlide.update({
      where: { id },
      data: {
        eyebrow: input.eyebrow ?? null,
        title: input.title,
        description: input.description ?? null,
        primaryActionLabel: input.primaryActionLabel ?? null,
        primaryActionHref: input.primaryActionHref ?? null,
        secondaryActionLabel: input.secondaryActionLabel ?? null,
        secondaryActionHref: input.secondaryActionHref ?? null,
        imageUrl: input.imageUrl ?? null,
        imageAlt: input.imageAlt ?? null,
        tone: input.tone,
        isActive: input.isActive,
        sortOrder: input.sortOrder,
      },
    });
  }

  async deleteSlide(id: string): Promise<void> {
    await prisma.sliderSlide.delete({ where: { id } });
  }
}
