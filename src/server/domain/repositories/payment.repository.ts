export type InitiatePaytrPaymentInput = {
  orderId: string;
  userIp: string;
};

export type InitiatePaytrPaymentResult = {
  orderId: string;
  orderNumber: string;
  merchantOid: string;
  iframeToken: string;
  iframeUrl: string;
};

export interface PaymentRepository {
  initiatePaytrPayment(
    input: InitiatePaytrPaymentInput,
  ): Promise<InitiatePaytrPaymentResult>;
}
