import {
  HomeSectionItemType,
  HomeSectionType,
  VisualTone,
} from "@/generated/prisma/client";
import type {
  HomepageCategoryCardEntity,
  HomepageHeroSlideEntity,
  HomepageProductCardEntity,
  HomepagePromoBannerEntity,
  HomepageSectionEntity,
  HomepageVisualTone,
} from "@/server/domain/entities/homepage-section.entity";
import type { HomepageContentRepository } from "@/server/domain/repositories/homepage-content.repository";
import { prisma } from "@/server/infrastructure/database/prisma/prisma-client";

function mapVisualTone(tone: VisualTone): HomepageVisualTone {
  switch (tone) {
    case VisualTone.SAGE:
      return "sage";

    case VisualTone.PEACH:
      return "peach";

    case VisualTone.ROSE:
    default:
      return "rose";
  }
}

export class PrismaHomepageContentRepository
  implements HomepageContentRepository
{
  async findActiveHomepageSections(): Promise<HomepageSectionEntity[]> {
    const sections = await prisma.homeSection.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        sortOrder: "asc",
      },
      include: {
        slider: {
          include: {
            slides: {
              where: {
                isActive: true,
              },
              orderBy: {
                sortOrder: "asc",
              },
            },
          },
        },
        banner: true,
        items: {
          where: {
            isActive: true,
          },
          orderBy: {
            sortOrder: "asc",
          },
          include: {
            product: {
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
              },
            },
          },
        },
      },
    });

    return sections.flatMap((section): HomepageSectionEntity[] => {
      switch (section.type) {
        case HomeSectionType.HERO_SLIDER: {
          if (
            !section.slider ||
            !section.slider.isActive ||
            section.slider.slides.length === 0
          ) {
            return [];
          }

          const slides: HomepageHeroSlideEntity[] =
            section.slider.slides.map((slide) => ({
              id: slide.id,
              eyebrow: slide.eyebrow ?? undefined,
              title: slide.title,
              description: slide.description ?? "",
              primaryActionLabel: slide.primaryActionLabel ?? undefined,
              primaryActionHref: slide.primaryActionHref ?? undefined,
              secondaryActionLabel:
                slide.secondaryActionLabel ?? undefined,
              secondaryActionHref:
                slide.secondaryActionHref ?? undefined,
              imageUrl: slide.imageUrl,
              imageAlt: slide.imageAlt ?? undefined,
              tone: mapVisualTone(slide.tone),
            }));

          return [
            {
              id: section.id,
              type: "hero-slider",
              title: section.title ?? undefined,
              description: section.description ?? undefined,
              isActive: section.isActive,
              sortOrder: section.sortOrder,
              content: {
                slides,
              },
            },
          ];
        }

        case HomeSectionType.CATEGORY_SHOWCASE: {
          const categories: HomepageCategoryCardEntity[] = section.items
            .filter(
              (item) =>
                item.itemType === HomeSectionItemType.CATEGORY_CARD &&
                item.title &&
                item.href,
            )
            .map((item) => ({
              id: item.id,
              title: item.title as string,
              description: item.description ?? "",
              href: item.href as string,
              badge: item.badge ?? undefined,
              tone: mapVisualTone(item.tone),
            }));

          if (categories.length === 0) {
            return [];
          }

          return [
            {
              id: section.id,
              type: "category-showcase",
              title: section.title ?? undefined,
              description: section.description ?? undefined,
              isActive: section.isActive,
              sortOrder: section.sortOrder,
              content: {
                categories,
              },
            },
          ];
        }

        case HomeSectionType.PROMO_BANNER: {
          if (!section.banner || !section.banner.isActive) {
            return [];
          }

          const banner: HomepagePromoBannerEntity = {
            id: section.banner.id,
            eyebrow: section.banner.eyebrow ?? undefined,
            title: section.banner.title,
            description: section.banner.description ?? "",
            actionLabel: section.banner.actionLabel ?? undefined,
            actionHref: section.banner.actionHref ?? undefined,
            tone: mapVisualTone(section.banner.tone),
          };

          return [
            {
              id: section.id,
              type: "promo-banner",
              title: section.title ?? undefined,
              description: section.description ?? undefined,
              isActive: section.isActive,
              sortOrder: section.sortOrder,
              content: {
                banner,
              },
            },
          ];
        }

        case HomeSectionType.PRODUCT_SHOWCASE: {
          const products: HomepageProductCardEntity[] = section.items
            .filter(
              (item) =>
                item.itemType === HomeSectionItemType.PRODUCT_REFERENCE &&
                item.product &&
                item.product.isActive,
            )
            .map((item) => {
              const product = item.product!;
              const primaryImage =
                product.images.find((image) => image.isPrimary) ??
                product.images[0];

              return {
                id: product.id,
                name: product.name,
                slug: product.slug,
                categoryLabel: product.category.name,
                price: Number(product.basePrice),
                compareAtPrice: product.compareAtPrice
                  ? Number(product.compareAtPrice)
                  : undefined,
                badge: item.badge ?? undefined,
                imageUrl: primaryImage?.url ?? null,
                imageAlt: primaryImage?.alt ?? product.name,
                tone: mapVisualTone(item.tone),
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

          if (products.length === 0) {
            return [];
          }

          return [
            {
              id: section.id,
              type: "product-showcase",
              eyebrow: section.eyebrow ?? undefined,
              title: section.title ?? undefined,
              description: section.description ?? undefined,
              actionLabel: section.actionLabel ?? undefined,
              actionHref: section.actionHref ?? undefined,
              isActive: section.isActive,
              sortOrder: section.sortOrder,
              content: {
                products,
              },
            },
          ];
        }

        default:
          return [];
      }
    });
  }
}