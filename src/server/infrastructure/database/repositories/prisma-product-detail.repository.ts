import type {
  ProductDetailAttributeGroupEntity,
  ProductDetailAttributeValueEntity,
  ProductDetailEntity,
  ProductDetailVariantEntity,
} from "@/server/domain/entities/product-detail.entity";
import type { ProductDetailRepository } from "@/server/domain/repositories/product-detail.repository";
import { prisma } from "@/server/infrastructure/database/prisma/prisma-client";

export class PrismaProductDetailRepository
  implements ProductDetailRepository
{
  async findProductDetailBySlug(
    slug: string,
  ): Promise<ProductDetailEntity | null> {
    const product = await prisma.product.findUnique({
      where: {
        slug,
      },
      include: {
        category: true,
        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
        variants: {
          where: {
            isActive: true,
          },
          orderBy: {
            sortOrder: "asc",
          },
        },
        attributeValues: {
          include: {
            attributeValue: {
              include: {
                attribute: true,
              },
            },
          },
        },
      },
    });

    if (!product || !product.isActive || !product.category.isActive) {
      return null;
    }

    const groupedAttributes = new Map<
      string,
      ProductDetailAttributeGroupEntity
    >();

    const sortedAttributeLinks = [...product.attributeValues].sort(
      (firstItem, secondItem) => {
        const firstAttributeSort =
          firstItem.attributeValue.attribute.sortOrder;
        const secondAttributeSort =
          secondItem.attributeValue.attribute.sortOrder;

        if (firstAttributeSort !== secondAttributeSort) {
          return firstAttributeSort - secondAttributeSort;
        }

        return (
          firstItem.attributeValue.sortOrder -
          secondItem.attributeValue.sortOrder
        );
      },
    );

    for (const item of sortedAttributeLinks) {
      const attribute = item.attributeValue.attribute;
      const value = item.attributeValue;

      if (!attribute.isActive || !attribute.isVisibleOnProductDetail) {
        continue;
      }

      const mappedValue: ProductDetailAttributeValueEntity = {
        id: value.id,
        value: value.value,
        slug: value.slug,
        colorHex: value.colorHex ?? undefined,
      };

      const existingGroup = groupedAttributes.get(attribute.id);

      if (existingGroup) {
        existingGroup.values.push(mappedValue);
        continue;
      }

      groupedAttributes.set(attribute.id, {
        id: attribute.id,
        name: attribute.name,
        slug: attribute.slug,
        displayType: attribute.displayType,
        values: [mappedValue],
      });
    }

    const variants: ProductDetailVariantEntity[] =
      product.variants.map((variant) => ({
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
      }));

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      category: {
        id: product.category.id,
        name: product.category.name,
        slug: product.category.slug,
      },
      shortDescription: product.shortDescription ?? undefined,
      description: product.description ?? undefined,
      basePrice: Number(product.basePrice),
      compareAtPrice: product.compareAtPrice
        ? Number(product.compareAtPrice)
        : undefined,
      isFeatured: product.isFeatured,
      images: product.images.map((image) => ({
        id: image.id,
        url: image.url,
        alt: image.alt ?? product.name,
        isPrimary: image.isPrimary,
      })),
      variants,
      attributes: Array.from(groupedAttributes.values()),
    };
  }
}