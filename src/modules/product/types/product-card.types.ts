export type ProductCardVariant = {
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

export type ProductCardItem = {
  id: string;
  name: string;
  slug: string;
  categoryLabel: string;
  price: number;
  compareAtPrice?: number;
  badge?: string;
  imageUrl?: string | null;
  imageAlt?: string;
  tone: "rose" | "sage" | "peach";
  variants?: ProductCardVariant[];
};