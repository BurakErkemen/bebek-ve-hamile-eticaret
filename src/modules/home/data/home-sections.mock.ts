import {
  heroSlides,
  homeCategoryCards,
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
];