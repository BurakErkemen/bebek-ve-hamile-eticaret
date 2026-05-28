export type BannerPlacement = "HOME_PROMO" | "CATEGORY_PROMO" | "GLOBAL_PROMO";
export type VisualTone = "ROSE" | "SAGE" | "PEACH";

export type BannerAdminListItem = {
  id: string;
  name: string;
  placement: BannerPlacement;
  title: string;
  isActive: boolean;
  sortOrder: number;
};

export type BannerAdminDetail = {
  id: string;
  name: string;
  placement: BannerPlacement;
  eyebrow: string | null;
  title: string;
  description: string | null;
  actionLabel: string | null;
  actionHref: string | null;
  imageUrl: string | null;
  imageAlt: string | null;
  tone: VisualTone;
  isActive: boolean;
  sortOrder: number;
};

export type BannerAdminInput = {
  name: string;
  placement: BannerPlacement;
  eyebrow?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  imageUrl?: string;
  imageAlt?: string;
  tone: VisualTone;
  isActive: boolean;
  sortOrder: number;
};
