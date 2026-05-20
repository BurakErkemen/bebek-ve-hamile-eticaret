export type ProductDetailImageEntity = {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
};

export type ProductDetailVariantEntity = {
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

export type ProductDetailAttributeValueEntity = {
  id: string;
  value: string;
  slug: string;
  colorHex?: string;
};

export type ProductDetailAttributeGroupEntity = {
  id: string;
  name: string;
  slug: string;
  displayType: "CHECKBOX" | "RADIO" | "COLOR_SWATCH" | "BADGE";
  values: ProductDetailAttributeValueEntity[];
};

export type ProductDetailEntity = {
  id: string;
  name: string;
  slug: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  shortDescription?: string;
  description?: string;
  basePrice: number;
  compareAtPrice?: number;
  isFeatured: boolean;
  images: ProductDetailImageEntity[];
  variants: ProductDetailVariantEntity[];
  attributes: ProductDetailAttributeGroupEntity[];
};