export type HomeSectionType =
  | "HERO_SLIDER"
  | "CATEGORY_SHOWCASE"
  | "PROMO_BANNER"
  | "PRODUCT_SHOWCASE";

export type HomeSectionItemType = "CATEGORY_CARD" | "CUSTOM_LINK" | "PRODUCT_REFERENCE";
export type VisualTone = "ROSE" | "SAGE" | "PEACH";

export type HomeSectionAdminListItem = {
  id: string;
  type: HomeSectionType;
  title: string | null;
  isActive: boolean;
  sortOrder: number;
  itemCount: number;
};

export type HomeSectionItemAdmin = {
  id: string;
  itemType: HomeSectionItemType;
  categoryId: string | null;
  categoryName: string | null;
  productId: string | null;
  productName: string | null;
  title: string | null;
  description: string | null;
  href: string | null;
  badge: string | null;
  tone: VisualTone;
  isActive: boolean;
  sortOrder: number;
};

export type HomeSectionAdminDetail = {
  id: string;
  type: HomeSectionType;
  eyebrow: string | null;
  title: string | null;
  description: string | null;
  actionLabel: string | null;
  actionHref: string | null;
  sliderId: string | null;
  bannerId: string | null;
  isActive: boolean;
  sortOrder: number;
  items: HomeSectionItemAdmin[];
};

export type HomeSectionAdminInput = {
  type: HomeSectionType;
  eyebrow?: string;
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  sliderId?: string;
  bannerId?: string;
  isActive: boolean;
  sortOrder: number;
};

export type HomeSectionItemAdminInput = {
  itemType: HomeSectionItemType;
  categoryId?: string;
  productId?: string;
  title?: string;
  description?: string;
  href?: string;
  badge?: string;
  tone: VisualTone;
  isActive: boolean;
  sortOrder: number;
};
