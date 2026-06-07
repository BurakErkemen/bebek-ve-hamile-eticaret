import { describe, it, expect } from "vitest";
import { calculateShippingFee, parseShippingConfig } from "./shipping";
import type { ShippingConfig } from "./shipping";

describe("calculateShippingFee", () => {
  const standardConfig: ShippingConfig = { fee: 50, freeThreshold: 500 };

  describe("Happy path", () => {
    it("eşiğin altındaki sepete kargo ücreti uygular", () => {
      expect(calculateShippingFee(300, standardConfig)).toBe(50);
    });

    it("eşiğe tam ulaşan sepete ücretsiz kargo verir", () => {
      expect(calculateShippingFee(500, standardConfig)).toBe(0);
    });

    it("eşiğin üzerindeki sepete ücretsiz kargo verir", () => {
      expect(calculateShippingFee(750, standardConfig)).toBe(0);
    });
  });

  describe("Edge cases", () => {
    it("sıfır tutarlı sepette ücret almaz", () => {
      expect(calculateShippingFee(0, standardConfig)).toBe(0);
    });

    it("negatif subtotal'da (geçersiz durum) ücret almaz", () => {
      expect(calculateShippingFee(-100, standardConfig)).toBe(0);
    });

    it("freeThreshold null ise her zaman ücret uygular", () => {
      const config: ShippingConfig = { fee: 30, freeThreshold: null };
      expect(calculateShippingFee(99999, config)).toBe(30);
    });

    it("fee 0 ise (kargo bedava kampanyası) ücret almaz", () => {
      const config: ShippingConfig = { fee: 0, freeThreshold: 500 };
      expect(calculateShippingFee(100, config)).toBe(0);
    });

    it("eşiğin 1 kuruş altında ücret uygular (sınır testi)", () => {
      expect(calculateShippingFee(499.99, standardConfig)).toBe(50);
    });
  });
});

describe("parseShippingConfig", () => {
  describe("Happy path", () => {
    it("geçerli string değerleri sayıya çevirir", () => {
      expect(parseShippingConfig({ fee: "50", freeThreshold: "500" })).toEqual({
        fee: 50,
        freeThreshold: 500,
      });
    });
  });

  describe("Edge cases & error handling", () => {
    it("eksik değerlerde güvenli varsayılana düşer (fee:0, threshold:null)", () => {
      expect(parseShippingConfig({})).toEqual({ fee: 0, freeThreshold: null });
    });

    it("sayı olmayan string'leri güvenli varsayılana çevirir", () => {
      expect(
        parseShippingConfig({ fee: "abc", freeThreshold: "xyz" }),
      ).toEqual({ fee: 0, freeThreshold: null });
    });

    it("negatif değerleri reddedip varsayılana düşer", () => {
      expect(
        parseShippingConfig({ fee: "-10", freeThreshold: "-5" }),
      ).toEqual({ fee: 0, freeThreshold: null });
    });

    it("boş string'leri varsayılana çevirir", () => {
      expect(
        parseShippingConfig({ fee: "", freeThreshold: "" }),
      ).toEqual({ fee: 0, freeThreshold: null });
    });

    it("ondalıklı ücreti korur", () => {
      expect(parseShippingConfig({ fee: "29.90" }).fee).toBe(29.9);
    });
  });
});
