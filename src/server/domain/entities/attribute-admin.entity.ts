export type AttributeDisplayType = "CHECKBOX" | "RADIO" | "COLOR_SWATCH" | "BADGE";

export type AttributeAdminListItem = {
  id: string;
  name: string;
  slug: string;
  displayType: AttributeDisplayType;
  isFilterable: boolean;
  isActive: boolean;
  sortOrder: number;
  valueCount: number;
};

export type AttributeValueAdminItem = {
  id: string;
  value: string;
  slug: string;
  colorHex: string | null;
  sortOrder: number;
  isActive: boolean;
};

export type AttributeAdminDetail = {
  id: string;
  name: string;
  slug: string;
  displayType: AttributeDisplayType;
  isFilterable: boolean;
  isVisibleOnProductDetail: boolean;
  isActive: boolean;
  sortOrder: number;
  values: AttributeValueAdminItem[];
};

export type AttributeAdminInput = {
  name: string;
  slug: string;
  displayType: AttributeDisplayType;
  isFilterable: boolean;
  isVisibleOnProductDetail: boolean;
  isActive: boolean;
  sortOrder: number;
};

export type AttributeValueAdminInput = {
  value: string;
  slug: string;
  colorHex?: string;
  sortOrder: number;
  isActive: boolean;
};
