import { describe, it, expect } from "vitest";
import { checkoutRequestSchema } from "./checkout.validator";

/** Geçerli bir checkout payload'u üreten yardımcı (override edilebilir). */
function makeValidPayload(overrides: Record<string, unknown> = {}) {
  return {
    customer: {
      firstName: "Zeynep",
      lastName: "Kaya",
      email: "zeynep@example.com",
      phone: "05551234567",
    },
    shippingAddress: {
      city: "İstanbul",
      district: "Kadıköy",
      addressLine: "Caferağa Mah. Test Sokak No 1 Daire 2",
    },
    items: [{ variantId: "var_1", quantity: 2 }],
    ...overrides,
  };
}

describe("checkoutRequestSchema", () => {
  describe("Happy path", () => {
    it("eksiksiz geçerli siparişi kabul eder", () => {
      expect(checkoutRequestSchema.safeParse(makeValidPayload()).success).toBe(true);
    });

    it("country verilmezse 'Türkiye' varsayılanını uygular", () => {
      const parsed = checkoutRequestSchema.parse(makeValidPayload());
      expect(parsed.shippingAddress.country).toBe("Türkiye");
    });

    it("opsiyonel alanlar (neighborhood, postalCode, note) olmadan geçerlidir", () => {
      expect(checkoutRequestSchema.safeParse(makeValidPayload()).success).toBe(true);
    });
  });

  describe("Error handling", () => {
    it("boş sepeti (items min 1) reddeder", () => {
      expect(
        checkoutRequestSchema.safeParse(makeValidPayload({ items: [] })).success,
      ).toBe(false);
    });

    it("10 haneden kısa telefonu reddeder", () => {
      const payload = makeValidPayload();
      payload.customer.phone = "12345";
      expect(checkoutRequestSchema.safeParse(payload).success).toBe(false);
    });

    it("çok kısa açık adresi (min 10) reddeder", () => {
      const payload = makeValidPayload();
      payload.shippingAddress.addressLine = "kısa";
      expect(checkoutRequestSchema.safeParse(payload).success).toBe(false);
    });

    it("geçersiz e-postayı reddeder", () => {
      const payload = makeValidPayload();
      payload.customer.email = "gecersiz-email";
      expect(checkoutRequestSchema.safeParse(payload).success).toBe(false);
    });
  });

  describe("Edge cases — miktar sınırları", () => {
    it("miktar 0'ı reddeder (min 1)", () => {
      expect(
        checkoutRequestSchema.safeParse(
          makeValidPayload({ items: [{ variantId: "v", quantity: 0 }] }),
        ).success,
      ).toBe(false);
    });

    it("miktar 99'u kabul, 100'ü reddeder", () => {
      expect(
        checkoutRequestSchema.safeParse(
          makeValidPayload({ items: [{ variantId: "v", quantity: 99 }] }),
        ).success,
      ).toBe(true);
      expect(
        checkoutRequestSchema.safeParse(
          makeValidPayload({ items: [{ variantId: "v", quantity: 100 }] }),
        ).success,
      ).toBe(false);
    });

    it("ondalık miktarı reddeder (int olmalı)", () => {
      expect(
        checkoutRequestSchema.safeParse(
          makeValidPayload({ items: [{ variantId: "v", quantity: 1.5 }] }),
        ).success,
      ).toBe(false);
    });

    it("boş variantId'yi reddeder", () => {
      expect(
        checkoutRequestSchema.safeParse(
          makeValidPayload({ items: [{ variantId: "", quantity: 1 }] }),
        ).success,
      ).toBe(false);
    });
  });
});
