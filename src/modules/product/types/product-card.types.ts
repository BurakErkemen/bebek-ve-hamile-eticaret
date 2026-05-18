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
};