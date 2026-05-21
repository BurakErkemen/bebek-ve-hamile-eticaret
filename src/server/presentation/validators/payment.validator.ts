import { z } from "zod";

export const initiatePaytrPaymentRequestSchema = z.object({
  orderId: z.string().trim().min(1),
});

export type InitiatePaytrPaymentRequestDto = z.infer<
  typeof initiatePaytrPaymentRequestSchema
>;

export const paytrCallbackRequestSchema = z.object({
  merchant_oid: z.string().trim().min(1),
  status: z.enum(["success", "failed"]),
  total_amount: z.string().trim().min(1),
  hash: z.string().trim().min(1),
  failed_reason_code: z.string().trim().optional(),
  failed_reason_msg: z.string().trim().optional(),
});

export type PaytrCallbackRequestDto = z.infer<
  typeof paytrCallbackRequestSchema
>;