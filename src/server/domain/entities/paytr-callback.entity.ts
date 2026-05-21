export type PaytrCallbackStatus = "success" | "failed";

export type PaytrCallbackInput = {
  merchantOid: string;
  status: PaytrCallbackStatus;
  totalAmount: string;
  hash: string;
  failedReasonCode?: string;
  failedReasonMessage?: string;
};

export type PaytrCallbackResult = {
  shouldAcknowledge: boolean;
};
