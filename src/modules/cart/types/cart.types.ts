export type CartItem = {
  productId: string;
  variantId: string;
  sku: string;

  productName: string;
  productSlug: string;
  categoryLabel: string;

  imageUrl?: string | null;
  imageAlt?: string;

  variantLabel: string;

  unitPrice: number;
  compareAtPrice?: number;

  quantity: number;
  stockQuantity: number;
};

export type AddCartItemInput = Omit<CartItem, "quantity"> & {
  quantity?: number;
};