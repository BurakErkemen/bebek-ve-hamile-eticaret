import { z } from "zod";

export const orderLookupSchema = z.object({
  orderNumber: z.string().trim().min(3).max(64),
  email: z.string().trim().email().max(160),
});

export type OrderLookupDto = z.infer<typeof orderLookupSchema>;
