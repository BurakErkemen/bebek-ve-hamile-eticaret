export type OrderAdminStatus =
  | "DRAFT"
  | "PENDING_PAYMENT"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type OrderAdminPaymentStatus =
  | "NOT_STARTED"
  | "PENDING"
  | "SUCCESS"
  | "FAILED"
  | "REFUNDED";

export type OrderAdminListItem = {
  id: string;
  orderNumber: string;
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  status: OrderAdminStatus;
  paymentStatus: OrderAdminPaymentStatus;
  totalAmount: string;
  itemCount: number;
  createdAt: Date;
};

export type OrderAdminItem = {
  id: string;
  productName: string;
  sku: string;
  variantLabel: string;
  imageUrl: string | null;
  unitPrice: string;
  quantity: number;
  lineTotal: string;
};

export type OrderAdminDetail = {
  id: string;
  orderNumber: string;
  merchantOid: string | null;
  status: OrderAdminStatus;
  paymentStatus: OrderAdminPaymentStatus;
  paymentFailureCode: string | null;
  paymentFailureMessage: string | null;
  paidAt: Date | null;
  cancelledAt: Date | null;
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerPhone: string;
  shippingCountry: string;
  shippingCity: string;
  shippingDistrict: string;
  shippingNeighborhood: string | null;
  shippingPostalCode: string | null;
  shippingAddressLine: string;
  customerNote: string | null;
  subtotal: string;
  shippingFee: string;
  discountAmount: string;
  totalAmount: string;
  items: OrderAdminItem[];
  createdAt: Date;
  updatedAt: Date;
};

export type OrderStatusUpdateInput = {
  status: OrderAdminStatus;
};
