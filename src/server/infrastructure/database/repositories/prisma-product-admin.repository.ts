import { prisma } from "../prisma/prisma-client";
import type { ProductAdminRepository } from "@/server/domain/repositories/product-admin.repository";
import type {
  ProductAdminListItem,
  ProductAdminDetail,
  ProductAdminInput,
} from "@/server/domain/entities/product-admin.entity";

export class PrismaProductAdminRepository implements ProductAdminRepository {
  async listProducts(): Promise<ProductAdminListItem[]> {
    const rows = await prisma.product.findMany({
      include: {
        category: { select: { id: true, name: true } },
        images: { where: { isPrimary: true }, take: 1, select: { url: true } },
        variants: { select: { stockQuantity: true } },
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });

    return rows.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      category: p.category,
      basePrice: Number(p.basePrice),
      isActive: p.isActive,
      isFeatured: p.isFeatured,
      totalStock: p.variants.reduce((s, v) => s + v.stockQuantity, 0),
      primaryImageUrl: p.images[0]?.url ?? null,
      createdAt: p.createdAt,
    }));
  }

  async findProductById(id: string): Promise<ProductAdminDetail | null> {
    const p = await prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        variants: { orderBy: { sortOrder: "asc" } },
      },
    });

    if (!p) return null;

    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      categoryId: p.categoryId,
      shortDescription: p.shortDescription,
      description: p.description,
      basePrice: Number(p.basePrice),
      compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
      isActive: p.isActive,
      isFeatured: p.isFeatured,
      sortOrder: p.sortOrder,
      images: p.images.map((img) => ({
        id: img.id,
        url: img.url,
        alt: img.alt,
        isPrimary: img.isPrimary,
        sortOrder: img.sortOrder,
      })),
      variants: p.variants.map((v) => ({
        id: v.id,
        sku: v.sku,
        size: v.size,
        colorName: v.colorName,
        colorHex: v.colorHex,
        price: v.price ? Number(v.price) : null,
        compareAtPrice: v.compareAtPrice ? Number(v.compareAtPrice) : null,
        stockQuantity: v.stockQuantity,
        isActive: v.isActive,
        sortOrder: v.sortOrder,
      })),
    };
  }

  async createProduct(input: ProductAdminInput): Promise<{ id: string }> {
    const product = await prisma.product.create({
      data: {
        name: input.name,
        slug: input.slug,
        categoryId: input.categoryId,
        shortDescription: input.shortDescription ?? null,
        description: input.description ?? null,
        basePrice: input.basePrice,
        compareAtPrice: input.compareAtPrice ?? null,
        isActive: input.isActive,
        isFeatured: input.isFeatured,
        sortOrder: input.sortOrder,
        images: { create: input.images },
        variants: { create: input.variants },
      },
    });
    return { id: product.id };
  }

  async updateProduct(id: string, input: ProductAdminInput): Promise<void> {
    await prisma.$transaction(async (tx) => {
      await tx.productImage.deleteMany({ where: { productId: id } });
      await tx.productVariant.deleteMany({ where: { productId: id } });
      await tx.product.update({
        where: { id },
        data: {
          name: input.name,
          slug: input.slug,
          categoryId: input.categoryId,
          shortDescription: input.shortDescription ?? null,
          description: input.description ?? null,
          basePrice: input.basePrice,
          compareAtPrice: input.compareAtPrice ?? null,
          isActive: input.isActive,
          isFeatured: input.isFeatured,
          sortOrder: input.sortOrder,
          images: { create: input.images },
          variants: { create: input.variants },
        },
      });
    });
  }

  async deleteProduct(id: string): Promise<void> {
    await prisma.product.delete({ where: { id } });
  }
}
