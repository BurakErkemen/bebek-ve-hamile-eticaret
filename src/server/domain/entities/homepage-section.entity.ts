export type HomepageVisualTone = "rose" | "sage" | "peach";

export type HomepageHeroSlideEntity = {
  id: string;
  eyebrow?: string;
  title: string;
  description: string;
  primaryActionLabel?: string;
  primaryActionHref?: string;
  secondaryActionLabel?: string;
  secondaryActionHref?: string;
  imageUrl?: string | null;
  imageAlt?: string;
  tone: HomepageVisualTone;
};

export type HomepageCategoryCardEntity = {
  id: string;
  title: string;
  description: string;
  href: string;
  badge?: string;
  tone: HomepageVisualTone;
};

export type HomepagePromoBannerEntity = {
  id: string;
  eyebrow?: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  tone: HomepageVisualTone;
};

export type HomepageSectionBaseEntity = {
  id: string;
  title?: string;
  description?: string;
  isActive: boolean;
  sortOrder: number;
};

export type HomepageHeroSliderSectionEntity = HomepageSectionBaseEntity & {
  type: "hero-slider";
  content: {
    slides: HomepageHeroSlideEntity[];
  };
};

export type HomepageCategoryShowcaseSectionEntity =
  HomepageSectionBaseEntity & {
    type: "category-showcase";
    content: {
      categories: HomepageCategoryCardEntity[];
    };
  };

export type HomepagePromoBannerSectionEntity = HomepageSectionBaseEntity & {
  type: "promo-banner";
  content: {
    banner: HomepagePromoBannerEntity;
  };
};

export type HomepageSectionEntity =
  | HomepageHeroSliderSectionEntity
  | HomepageCategoryShowcaseSectionEntity
  | HomepagePromoBannerSectionEntity;