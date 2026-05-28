export type OrderSummaryStatus =
  | "DRAFT"
  | "PENDING_PAYMENT"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type OrderSummaryPaymentStatus =
  | "NOT_STARTED"
  | "PENDING"
  | "SUCCESS"
  | "FAILED"
  | "REFUNDED";

export type OrderSummaryItem = {
  productName: string;
  variantLabel: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  imageUrl: string | null;
};

export type OrderSummary = {
  orderNumber: string;
  status: OrderSummaryStatus;
  paymentStatus: OrderSummaryPaymentStatus;
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  shippingCity: string;
  shippingDistrict: string;
  shippingAddressLine: string;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  paymentFailureMessage: string | null;
  createdAt: Date;
  items: OrderSummaryItem[];
};
