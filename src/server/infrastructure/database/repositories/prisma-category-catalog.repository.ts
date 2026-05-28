import type {
  CategoryCatalogEntity,
  CategoryCatalogProductEntity,
  CategoryFilterGroupEntity,
} from "@/server/domain/entities/category-catalog.entity";
import type {
  CategoryCatalogFilters,
  CategoryCatalogQuery,
  CategoryCatalogRepository,
  CategoryCatalogSort,
} from "@/server/domain/repositories/category-catalog.repository";
import { prisma } from "@/server/infrastructure/database/prisma/prisma-client";

function getProductTone(index: number): "rose" | "sage" | "peach" {
  const tones: Array<"rose" | "sage" | "peach"> = [
    "rose",
    "sage",
    "peach",
  ];

  return tones[index % tones.length];
}

function sanitizeSelectedFilters(
  rawFilters: CategoryCatalogFilters,
  filterGroups: CategoryFilterGroupEntity[],
): CategoryCatalogFilters {
  const sanitizedFilters: CategoryCatalogFilters = {};

  for (const filterGroup of filterGroups) {
    const requestedValues = rawFilters[filterGroup.slug] ?? [];

    const allowedValueSlugs = new Set(
      filterGroup.values.map((value) => value.slug),
    );

    const validValues = requestedValues.filter((valueSlug) =>
      allowedValueSlugs.has(valueSlug),
    );

    if (validValues.length > 0) {
      sanitizedFilters[filterGroup.slug] = validValues;
    }
  }

  return sanitizedFilters;
}

function buildOrderBy(sort: CategoryCatalogSort) {
  switch (sort) {
    case "price-asc":
      return {
        basePrice: "asc" as const,
      };

    case "price-desc":
      return {
        basePrice: "desc" as const,
      };

    case "newest":
      return {
        createdAt: "desc" as const,
      };

    case "default":
    default:
      return {
        sortOrder: "asc" as const,
      };
  }
}

export class PrismaCategoryCatalogRepository
  implements CategoryCatalogRepository
{
  async findCategoryCatalogBySlug(
    slug: string,
    query: CategoryCatalogQuery,
  ): Promise<CategoryCatalogEntity | null> {
    const category = await prisma.category.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        isActive: true,
      },
    });

    if (!category || !category.isActive) {
      return null;
    }

    const categoryAttributes = await prisma.categoryAttribute.findMany({
      where: {
        categoryId: category.id,
        isFilterVisible: true,
        attribute: {
          is: {
            isActive: true,
            isFilterable: true,
          },
        },
      },
      orderBy: {
        sortOrder: "asc",
      },
      include: {
        attribute: {
          include: {
            values: {
              where: {
                isActive: true,
                productLinks: {
                  some: {
                    product: {
                      is: {
                        categoryId: category.id,
                        isActive: true,
                      },
                    },
                  },
                },
              },
              orderBy: {
                sortOrder: "asc",
              },
            },
          },
        },
      },
    });

    const preliminaryFilterGroups: CategoryFilterGroupEntity[] =
      categoryAttributes
        .filter((categoryAttribute) => {
          return categoryAttribute.attribute.values.length > 0;
        })
        .map((categoryAttribute) => ({
          id: categoryAttribute.attribute.id,
          name: categoryAttribute.attribute.name,
          slug: categoryAttribute.attribute.slug,
          displayType: categoryAttribute.attribute.displayType,
          values: categoryAttribute.attribute.values.map((value) => ({
            id: value.id,
            value: value.value,
            slug: value.slug,
            colorHex: value.colorHex ?? undefined,
            isSelected: false,
          })),
        }));

    const selectedFilters = sanitizeSelectedFilters(
      query.attributeFilters,
      preliminaryFilterGroups,
    );

    const filterGroups: CategoryFilterGroupEntity[] =
      preliminaryFilterGroups.map((filterGroup) => {
        const selectedValueSlugs = new Set(
          selectedFilters[filterGroup.slug] ?? [],
        );

        return {
          ...filterGroup,
          values: filterGroup.values.map((value) => ({
            ...value,
            isSelected: selectedValueSlugs.has(value.slug),
          })),
        };
      });

    const selectedColorLabels = new Set<string>();
    const selectedSizeLabels = new Set<string>();
    let selectedColorHex: string | undefined;

    for (const filterGroup of filterGroups) {
      const selectedValues = filterGroup.values.filter(
        (value) => value.isSelected,
      );

      if (selectedValues.length === 0) {
        continue;
      }

      if (filterGroup.displayType === "COLOR_SWATCH") {
        for (const value of selectedValues) {
          selectedColorLabels.add(value.value.trim().toLowerCase());
          if (!selectedColorHex) {
            selectedColorHex = value.colorHex;
          }
        }
      } else {
        for (const value of selectedValues) {
          selectedSizeLabels.add(value.value.trim().toLowerCase());
        }
      }
    }

    const hasVariantSelection =
      selectedColorLabels.size > 0 || selectedSizeLabels.size > 0;

    const attributeFilterClauses = Object.entries(selectedFilters).map(
      ([attributeSlug, valueSlugs]) => ({
        attributeValues: {
          some: {
            attributeValue: {
              is: {
                slug: {
                  in: valueSlugs,
                },
                attribute: {
                  is: {
                    slug: attributeSlug,
                  },
                },
              },
            },
          },
        },
      }),
    );

    const priceFilter: {
      gte?: number;
      lte?: number;
    } = {};

    if (typeof query.minPrice === "number") {
      priceFilter.gte = query.minPrice;
    }

    if (typeof query.maxPrice === "number") {
      priceFilter.lte = query.maxPrice;
    }

    const hasPriceFilter = Object.keys(priceFilter).length > 0;

    const products = await prisma.product.findMany({
  where: {
    categoryId: category.id,
    isActive: true,

    ...(hasPriceFilter
      ? {
          basePrice: priceFilter,
        }
      : {}),

    ...(attributeFilterClauses.length > 0
      ? {
          AND: attributeFilterClauses,
        }
      : {}),
  },
  orderBy: buildOrderBy(query.sort),
  include: {
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
  },
});

    const mappedProducts: CategoryCatalogProductEntity[] = products.map(
      (product, index) => {
        const primaryImage =
          product.images.find((image) => image.isPrimary) ??
          product.images[0];

        const matchingVariants = hasVariantSelection
          ? product.variants.filter((variant) => {
              const colorMatches =
                selectedColorLabels.size === 0 ||
                (variant.colorName != null &&
                  selectedColorLabels.has(
                    variant.colorName.trim().toLowerCase(),
                  ));

              const sizeMatches =
                selectedSizeLabels.size === 0 ||
                (variant.size != null &&
                  selectedSizeLabels.has(variant.size.trim().toLowerCase()));

              return colorMatches && sizeMatches;
            })
          : [];

        const matchedVariant =
          matchingVariants.find((variant) => variant.stockQuantity > 0) ??
          matchingVariants[0];

        const displayPrice =
          matchedVariant?.price != null
            ? Number(matchedVariant.price)
            : Number(product.basePrice);

        const displayCompareAtPrice =
          matchedVariant?.compareAtPrice != null
            ? Number(matchedVariant.compareAtPrice)
            : product.compareAtPrice
              ? Number(product.compareAtPrice)
              : undefined;

        const selectedVariant = matchedVariant
          ? {
              label:
                [matchedVariant.size, matchedVariant.colorName]
                  .filter(Boolean)
                  .join(" / ") || matchedVariant.sku,
              colorHex: matchedVariant.colorHex ?? selectedColorHex,
            }
          : undefined;

        return {
          id: product.id,
          name: product.name,
          slug: product.slug,
          categoryLabel: category.name,
          price: displayPrice,
          compareAtPrice: displayCompareAtPrice,
          selectedVariant,
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
      },
    );

    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description ?? undefined,
      filters: filterGroups,
      products: mappedProducts,
    };
  }
}