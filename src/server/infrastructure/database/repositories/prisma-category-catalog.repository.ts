import type {
  CategoryCatalogEntity,
  CategoryCatalogProductEntity,
} from "@/server/domain/entities/category-catalog.entity";
import type { CategoryCatalogRepository } from "@/server/domain/repositories/category-catalog.repository";
import { prisma } from "@/server/infrastructure/database/prisma/prisma-client";

function getProductTone(index: number): "rose" | "sage" | "peach" {
  const tones: Array<"rose" | "sage" | "peach"> = [
    "rose",
    "sage",
    "peach",
  ];

  return tones[index % tones.length];
}

export class PrismaCategoryCatalogRepository
  implements CategoryCatalogRepository
{
  async findCategoryCatalogBySlug(
    slug: string,
  ): Promise<CategoryCatalogEntity | null> {
    const category = await prisma.category.findUnique({
      where: {
        slug,
      },
      include: {
        products: {
          where: {
            isActive: true,
          },
          orderBy: {
            sortOrder: "asc",
          },
          include: {
            images: {
              orderBy: {
                sortOrder: "asc",
              },
            },
          },
        },
      },
    });

    if (!category || !category.isActive) {
      return null;
    }

    const products: CategoryCatalogProductEntity[] =
      category.products.map((product, index) => {
        const primaryImage =
          product.images.find((image) => image.isPrimary) ??
          product.images[0];

        return {
          id: product.id,
          name: product.name,
          slug: product.slug,
          categoryLabel: category.name,
          price: Number(product.basePrice),
          compareAtPrice: product.compareAtPrice
            ? Number(product.compareAtPrice)
            : undefined,
          imageUrl: primaryImage?.url ?? null,
          imageAlt: primaryImage?.alt ?? product.name,
          badge: product.isFeatured ? "Öne Çıkan" : undefined,
          tone: getProductTone(index),
        };
      });

    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description ?? undefined,
      products,
    };
  }
}