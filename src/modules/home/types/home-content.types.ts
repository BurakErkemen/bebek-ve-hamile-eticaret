export type HeroSlide = {
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
  tone: "rose" | "sage" | "peach";
};

export type HomeCategoryCard = {
  id: string;
  title: string;
  description: string;
  href: string;
  badge?: string;
  tone: "rose" | "sage" | "peach";
};

export type HomePromoBanner = {
  id: string;
  eyebrow?: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  tone: "rose" | "sage" | "peach";
};