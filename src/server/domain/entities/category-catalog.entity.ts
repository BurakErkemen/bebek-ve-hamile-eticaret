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
};

export type CategoryCatalogEntity = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  products: CategoryCatalogProductEntity[];
};