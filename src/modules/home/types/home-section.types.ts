import type {
  HeroSlide,
  HomeCategoryCard,
  HomePromoBanner,
} from "@/modules/home/types/home-content.types";
import type { ProductCardItem } from "@/modules/product/types/product-card.types";

export type HomeSectionBase = {
  id: string;
  title?: string;
  description?: string;
  isActive: boolean;
  sortOrder: number;
};

export type HeroSliderSection = HomeSectionBase & {
  type: "hero-slider";
  content: {
    slides: HeroSlide[];
  };
};

export type CategoryShowcaseSection = HomeSectionBase & {
  type: "category-showcase";
  content: {
    categories: HomeCategoryCard[];
  };
};

export type PromoBannerSection = HomeSectionBase & {
  type: "promo-banner";
  content: {
    banner: HomePromoBanner;
  };
};

export type ProductShowcaseSection = HomeSectionBase & {
  type: "product-showcase";
  eyebrow?: string;
  actionLabel?: string;
  actionHref?: string;
  content: {
    products: ProductCardItem[];
  };
};

export type HomeSection =
  | HeroSliderSection
  | CategoryShowcaseSection
  | PromoBannerSection
  | ProductShowcaseSection;