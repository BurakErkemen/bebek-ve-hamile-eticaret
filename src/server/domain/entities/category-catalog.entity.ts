export type CategoryCatalogProductVariantEntity = {
  id: string;
  sku: string;
  size?: string;
  colorName?: string;
  colorHex?: string;
  price?: number;
  compareAtPrice?: number;
  stockQuantity: number;
  isInStock: boolean;
};

export type CategoryCatalogProductEntity = {
  id: string;
  name: string;
  slug: string;
  categoryLabel: string;
  price: number;
  compareAtPrice?: number;
  imageUrl?: string | null;
  imageAlt?: string;
  badge?: string;
  tone: "rose" | "sage" | "peach";
  variants: CategoryCatalogProductVariantEntity[];
};

export type CategoryFilterValueEntity = {
  id: string;
  value: string;
  slug: string;
  colorHex?: string;
  isSelected: boolean;
};

export type CategoryFilterGroupEntity = {
  id: string;
  name: string;
  slug: string;
  displayType: "CHECKBOX" | "RADIO" | "COLOR_SWATCH" | "BADGE";
  values: CategoryFilterValueEntity[];
};

export type CategoryCatalogEntity = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  filters: CategoryFilterGroupEntity[];
  products: CategoryCatalogProductEntity[];
};
