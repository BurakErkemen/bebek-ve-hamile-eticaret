export type SliderPlacement = "HOME_HERO";
export type VisualTone = "ROSE" | "SAGE" | "PEACH";

export type SliderAdminListItem = {
  id: string;
  name: string;
  placement: SliderPlacement;
  isActive: boolean;
  sortOrder: number;
  slideCount: number;
};

export type SliderSlideAdminItem = {
  id: string;
  eyebrow: string | null;
  title: string;
  description: string | null;
  primaryActionLabel: string | null;
  primaryActionHref: string | null;
  secondaryActionLabel: string | null;
  secondaryActionHref: string | null;
  imageUrl: string | null;
  imageAlt: string | null;
  tone: VisualTone;
  isActive: boolean;
  sortOrder: number;
};

export type SliderAdminDetail = {
  id: string;
  name: string;
  placement: SliderPlacement;
  isActive: boolean;
  sortOrder: number;
  slides: SliderSlideAdminItem[];
};

export type SliderAdminInput = {
  name: string;
  placement: SliderPlacement;
  isActive: boolean;
  sortOrder: number;
};

export type SliderSlideAdminInput = {
  eyebrow?: string;
  title: string;
  description?: string;
  primaryActionLabel?: string;
  primaryActionHref?: string;
  secondaryActionLabel?: string;
  secondaryActionHref?: string;
  imageUrl?: string;
  imageAlt?: string;
  tone: VisualTone;
  isActive: boolean;
  sortOrder: number;
};
