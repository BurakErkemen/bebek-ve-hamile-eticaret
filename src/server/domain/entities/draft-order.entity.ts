export type CreateDraftOrderInput = {
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };

  shippingAddress: {
    country: string;
    city: string;
    district: string;
    neighborhood?: string;
    postalCode?: string;
    addressLine: string;
  };

  note?: string;

  items: Array<{
    variantId: string;
    quantity: number;
  }>;
};

export type DraftOrderResult = {
  orderId: string;
  orderNumber: string;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
};