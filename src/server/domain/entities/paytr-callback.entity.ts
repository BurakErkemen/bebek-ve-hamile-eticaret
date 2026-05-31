export type PaytrCallbackStatus = "success" | "failed";

export type PaytrCallbackInput = {
  merchantOid: string;
  status: PaytrCallbackStatus;
  totalAmount: string;
  hash: string;
  failedReasonCode?: string;
  failedReasonMessage?: string;
};

export type OrderConfirmationItem = {
  name: string;
  quantity: number;
  unitPrice: number;
};

/**
 * Sipariş onay e-postası için gereken veriler. Yalnızca sipariş ilk kez
 * başarıyla ödendiğinde (idempotency guard'ının içinde) üretilir.
 */
export type OrderConfirmationData = {
  to: string;
  orderNumber: string;
  customerFirstName: string;
  customerLastName: string;
  items: OrderConfirmationItem[];
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
};

export type PaytrCallbackResult = {
  shouldAcknowledge: boolean;
  /** Sipariş ilk kez ödendiğinde dolu gelir; aksi halde null/undefined. */
  orderConfirmation?: OrderConfirmationData | null;
};
