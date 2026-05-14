import type {
  HeroSlide,
  HomeCategoryCard,
} from "@/modules/home/types/home-content.types";

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

export type HomeSection =
  | HeroSliderSection
  | CategoryShowcaseSection;