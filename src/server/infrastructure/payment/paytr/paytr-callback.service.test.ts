import { describe, it, expect } from "vitest";
import { createHmac } from "node:crypto";
import { PaytrCallbackService } from "./paytr-callback.service";
import type { PaytrConfig } from "./paytr.config";

/**
 * PayTR webhook hash doğrulaması (HMAC-SHA256, base64, timing-safe).
 * Config tam bir nesne gerektirir; testte yalnızca hash için gereken
 * alanlar anlamlı, kalanı dummy.
 */
const config: PaytrConfig = {
  merchantId: "test-id",
  merchantKey: "test-key",
  merchantSalt: "test-salt",
  testMode: "1",
  debugOn: "0",
  noInstallment: "0",
  maxInstallment: "0",
  timeoutLimit: "30",
  currency: "TL",
  appUrl: "http://localhost:3000",
};

/** PayTR'ın beklediği geçerli hash'i üreten yardımcı (testin "doğru" referansı). */
function makeValidHash(merchantOid: string, status: string, totalAmount: string): string {
  const raw = merchantOid + config.merchantSalt + status + totalAmount;
  return createHmac("sha256", config.merchantKey).update(raw).digest("base64");
}

describe("PaytrCallbackService.verifyHash", () => {
  const service = new PaytrCallbackService(config);

  describe("Happy path", () => {
    it("geçerli hash'i kabul eder", () => {
      const merchantOid = "ORDER123";
      const status = "success";
      const totalAmount = "15000";
      const validHash = makeValidHash(merchantOid, status, totalAmount);

      expect(
        service.verifyHash({ merchantOid, status, totalAmount, receivedHash: validHash }),
      ).toBe(true);
    });

    it("failed status için de doğru hash'i kabul eder", () => {
      const hash = makeValidHash("ORDER9", "failed", "0");
      expect(
        service.verifyHash({
          merchantOid: "ORDER9",
          status: "failed",
          totalAmount: "0",
          receivedHash: hash,
        }),
      ).toBe(true);
    });
  });

  describe("Error handling — sahte/kurcalanmış istekler", () => {
    it("yanlış hash'i reddeder", () => {
      expect(
        service.verifyHash({
          merchantOid: "ORDER123",
          status: "success",
          totalAmount: "15000",
          receivedHash: "tamamen-yanlis-hash",
        }),
      ).toBe(false);
    });

    it("doğru hash ama farklı tutar (manipülasyon) reddedilir", () => {
      const hash = makeValidHash("ORDER123", "success", "15000");
      // Saldırgan tutarı değiştirip aynı hash'i gönderiyor
      expect(
        service.verifyHash({
          merchantOid: "ORDER123",
          status: "success",
          totalAmount: "1",
          receivedHash: hash,
        }),
      ).toBe(false);
    });

    it("boş hash'i reddeder", () => {
      expect(
        service.verifyHash({
          merchantOid: "ORDER123",
          status: "success",
          totalAmount: "15000",
          receivedHash: "",
        }),
      ).toBe(false);
    });

    it("farklı uzunlukta hash'te timing-safe karşılaştırma çökmeden false döner", () => {
      expect(
        service.verifyHash({
          merchantOid: "X",
          status: "success",
          totalAmount: "1",
          receivedHash: "kisa",
        }),
      ).toBe(false);
    });
  });
});
