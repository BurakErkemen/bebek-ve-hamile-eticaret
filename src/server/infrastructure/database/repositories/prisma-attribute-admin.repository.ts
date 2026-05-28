import { prisma } from "../prisma/prisma-client";
import type { AttributeAdminRepository } from "@/server/domain/repositories/attribute-admin.repository";
import type {
  AttributeAdminListItem,
  AttributeAdminDetail,
  AttributeAdminInput,
  AttributeValueAdminInput,
  AttributeDisplayType,
} from "@/server/domain/entities/attribute-admin.entity";

export class PrismaAttributeAdminRepository implements AttributeAdminRepository {
  async listAttributes(): Promise<AttributeAdminListItem[]> {
    const rows = await prisma.attribute.findMany({
      include: { _count: { select: { values: true } } },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
    return rows.map((a) => ({
      id: a.id,
      name: a.name,
      slug: a.slug,
      displayType: a.displayType as AttributeDisplayType,
      isFilterable: a.isFilterable,
      isActive: a.isActive,
      sortOrder: a.sortOrder,
      valueCount: a._count.values,
    }));
  }

  async findAttributeById(id: string): Promise<AttributeAdminDetail | null> {
    const a = await prisma.attribute.findUnique({
      where: { id },
      include: {
        values: { orderBy: [{ sortOrder: "asc" }, { value: "asc" }] },
      },
    });
    if (!a) return null;
    return {
      id: a.id,
      name: a.name,
      slug: a.slug,
      displayType: a.displayType as AttributeDisplayType,
      isFilterable: a.isFilterable,
      isVisibleOnProductDetail: a.isVisibleOnProductDetail,
      isActive: a.isActive,
      sortOrder: a.sortOrder,
      values: a.values.map((v) => ({
        id: v.id,
        value: v.value,
        slug: v.slug,
        colorHex: v.colorHex,
        sortOrder: v.sortOrder,
        isActive: v.isActive,
      })),
    };
  }

  async createAttribute(input: AttributeAdminInput): Promise<{ id: string }> {
    const a = await prisma.attribute.create({
      data: {
        name: input.name,
        slug: input.slug,
        displayType: input.displayType,
        isFilterable: input.isFilterable,
        isVisibleOnProductDetail: input.isVisibleOnProductDetail,
        isActive: input.isActive,
        sortOrder: input.sortOrder,
      },
    });
    return { id: a.id };
  }

  async updateAttribute(id: string, input: AttributeAdminInput): Promise<void> {
    await prisma.attribute.update({
      where: { id },
      data: {
        name: input.name,
        slug: input.slug,
        displayType: input.displayType,
        isFilterable: input.isFilterable,
        isVisibleOnProductDetail: input.isVisibleOnProductDetail,
        isActive: input.isActive,
        sortOrder: input.sortOrder,
      },
    });
  }

  async deleteAttribute(id: string): Promise<void> {
    await prisma.attribute.delete({ where: { id } });
  }

  async createAttributeValue(attributeId: string, input: AttributeValueAdminInput): Promise<{ id: string }> {
    const v = await prisma.attributeValue.create({
      data: {
        attributeId,
        value: input.value,
        slug: input.slug,
        colorHex: input.colorHex ?? null,
        sortOrder: input.sortOrder,
        isActive: input.isActive,
      },
    });
    return { id: v.id };
  }

  async updateAttributeValue(id: string, input: AttributeValueAdminInput): Promise<void> {
    await prisma.attributeValue.update({
      where: { id },
      data: {
        value: input.value,
        slug: input.slug,
        colorHex: input.colorHex ?? null,
        sortOrder: input.sortOrder,
        isActive: input.isActive,
      },
    });
  }

  async deleteAttributeValue(id: string): Promise<void> {
    await prisma.attributeValue.delete({ where: { id } });
  }
}
