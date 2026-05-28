export type ProductAdminListItem = {
  id: string;
  name: string;
  slug: string;
  category: { id: string; name: string };
  basePrice: number;
  isActive: boolean;
  isFeatured: boolean;
  totalStock: number;
  primaryImageUrl: string | null;
  createdAt: Date;
};

export type ProductAdminDetail = {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  shortDescription: string | null;
  description: string | null;
  basePrice: number;
  compareAtPrice: number | null;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  images: {
    id: string;
    url: string;
    alt: string | null;
    isPrimary: boolean;
    sortOrder: number;
  }[];
  variants: {
    id: string;
    sku: string;
    size: string | null;
    colorName: string | null;
    colorHex: string | null;
    price: number | null;
    compareAtPrice: number | null;
    stockQuantity: number;
    isActive: boolean;
    sortOrder: number;
  }[];
};

export type ProductAdminImageInput = {
  url: string;
  alt?: string;
  isPrimary: boolean;
  sortOrder: number;
};

export type ProductAdminVariantInput = {
  sku: string;
  size?: string;
  colorName?: string;
  colorHex?: string;
  price?: number;
  compareAtPrice?: number;
  stockQuantity: number;
  isActive: boolean;
  sortOrder: number;
};

export type ProductAdminInput = {
  name: string;
  slug: string;
  categoryId: string;
  shortDescription?: string;
  description?: string;
  basePrice: number;
  compareAtPrice?: number;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  images: ProductAdminImageInput[];
  variants: ProductAdminVariantInput[];
};
