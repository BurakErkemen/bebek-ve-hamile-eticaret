
import {
  featuredProducts,
  heroSlides,
  homeCategoryCards,
  homePromoBanner,
} from "@/modules/home/data/home-content.mock";
import type { HomeSection } from "@/modules/home/types/home-section.types";

export const homeSections: HomeSection[] = [
  {
    id: "homepage-hero-slider",
    type: "hero-slider",
    isActive: true,
    sortOrder: 1,
    content: {
      slides: heroSlides,
    },
  },
  {
    id: "homepage-category-showcase",
    type: "category-showcase",
    title: "Ana alışveriş alanları",
    description:
      "Bebek, hamile ve anne-bebek kategorilerinde hızlı keşif alanı.",
    isActive: true,
    sortOrder: 2,
    content: {
      categories: homeCategoryCards,
    },
  },
  {
    id: "homepage-promo-banner",
    type: "promo-banner",
    isActive: true,
    sortOrder: 3,
    content: {
      banner: homePromoBanner,
    },
  },
  {
    id: "homepage-featured-products",
    type: "product-showcase",
    eyebrow: "Öne Çıkanlar",
    title: "Vitrine çıkarılacak ürün alanı",
    description:
      "Bu bölüm daha sonra admin panelden ürün seçimi, sıralama ve aktiflik kontrolü ile yönetilecek.",
    actionLabel: "Tüm Ürünleri Gör",
    actionHref: "/kategori/bebek-giyim",
    isActive: true,
    sortOrder: 4,
    content: {
      products: featuredProducts,
    },
  },
];