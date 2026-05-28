import { prisma } from "../prisma/prisma-client";
import type { CategoryAdminRepository } from "@/server/domain/repositories/category-admin.repository";
import type {
  CategoryAdminListItem,
  CategoryAdminDetail,
  CategoryAdminInput,
} from "@/server/domain/entities/category-admin.entity";

export class PrismaCategoryAdminRepository implements CategoryAdminRepository {
  async listCategories(): Promise<CategoryAdminListItem[]> {
    const rows = await prisma.category.findMany({
      include: {
        parent: { select: { name: true } },
        _count: { select: { products: true } },
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });

    return rows.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      parentId: c.parentId,
      parentName: c.parent?.name ?? null,
      isActive: c.isActive,
      sortOrder: c.sortOrder,
      productCount: c._count.products,
    }));
  }

  async findCategoryById(id: string): Promise<CategoryAdminDetail | null> {
    const c = await prisma.category.findUnique({ where: { id } });
    if (!c) return null;
    return {
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      parentId: c.parentId,
      isActive: c.isActive,
      sortOrder: c.sortOrder,
    };
  }

  async createCategory(input: CategoryAdminInput): Promise<{ id: string }> {
    const c = await prisma.category.create({
      data: {
        name: input.name,
        slug: input.slug,
        description: input.description ?? null,
        parentId: input.parentId ?? null,
        isActive: input.isActive,
        sortOrder: input.sortOrder,
      },
    });
    return { id: c.id };
  }

  async updateCategory(id: string, input: CategoryAdminInput): Promise<void> {
    await prisma.category.update({
      where: { id },
      data: {
        name: input.name,
        slug: input.slug,
        description: input.description ?? null,
        parentId: input.parentId ?? null,
        isActive: input.isActive,
        sortOrder: input.sortOrder,
      },
    });
  }

  async deleteCategory(id: string): Promise<void> {
    await prisma.category.delete({ where: { id } });
  }
}
