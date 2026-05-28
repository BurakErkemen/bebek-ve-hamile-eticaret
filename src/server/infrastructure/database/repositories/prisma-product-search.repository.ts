import type { CategoryCatalogProductEntity } from "@/server/domain/entities/category-catalog.entity";
import type { ProductSearchRepository } from "@/server/domain/repositories/product-search.repository";
import { prisma } from "@/server/infrastructure/database/prisma/prisma-client";

function getProductTone(index: number): "rose" | "sage" | "peach" {
  const tones: Array<"rose" | "sage" | "peach"> = ["rose", "sage", "peach"];
  return tones[index % tones.length];
}

export class PrismaProductSearchRepository implements ProductSearchRepository {
  async searchProducts(
    query: string,
    limit: number,
  ): Promise<CategoryCatalogProductEntity[]> {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { shortDescription: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          {
            variants: {
              some: { sku: { contains: query, mode: "insensitive" } },
            },
          },
        ],
      },
      orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }],
      take: limit,
      include: {
        category: { select: { name: true } },
        images: { orderBy: { sortOrder: "asc" } },
        variants: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    return products.map((product, index) => {
      const primaryImage =
        product.images.find((image) => image.isPrimary) ?? product.images[0];

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        categoryLabel: product.category.name,
        price: Number(product.basePrice),
        compareAtPrice: product.compareAtPrice
          ? Number(product.compareAtPrice)
          : undefined,
        imageUrl: primaryImage?.url ?? null,
        imageAlt: primaryImage?.alt ?? product.name,
        badge: product.isFeatured ? "Öne Çıkan" : undefined,
        tone: getProductTone(index),
        variants: product.variants.map((variant) => ({
          id: variant.id,
          sku: variant.sku,
          size: variant.size ?? undefined,
          colorName: variant.colorName ?? undefined,
          colorHex: variant.colorHex ?? undefined,
          price: variant.price ? Number(variant.price) : undefined,
          compareAtPrice: variant.compareAtPrice
            ? Number(variant.compareAtPrice)
            : undefined,
          stockQuantity: variant.stockQuantity,
          isInStock: variant.stockQuantity > 0,
        })),
      };
    });
  }
}
