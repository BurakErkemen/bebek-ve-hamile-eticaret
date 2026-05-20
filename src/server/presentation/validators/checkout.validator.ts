import { z } from "zod";

export const checkoutRequestSchema = z.object({
  customer: z.object({
    firstName: z.string().trim().min(2).max(80),
    lastName: z.string().trim().min(2).max(80),
    email: z.string().trim().email().max(160),
    phone: z.string().trim().min(10).max(20),
  }),

  shippingAddress: z.object({
    country: z.string().trim().min(2).max(80).default("Türkiye"),
    city: z.string().trim().min(2).max(80),
    district: z.string().trim().min(2).max(80),
    neighborhood: z.string().trim().max(120).optional(),
    postalCode: z.string().trim().max(20).optional(),
    addressLine: z.string().trim().min(10).max(500),
  }),

  note: z.string().trim().max(500).optional(),

  items: z
    .array(
      z.object({
        variantId: z.string().trim().min(1),
        quantity: z.number().int().min(1).max(99),
      }),
    )
    .min(1),
});

export type CheckoutRequestDto = z.infer<typeof checkoutRequestSchema>;
