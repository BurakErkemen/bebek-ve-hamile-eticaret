import { describe, it, expect, vi, afterEach } from "vitest";
import { createResetToken, verifyResetToken } from "./password-reset-token";

/**
 * Şifre sıfırlama token'ı (HMAC imzalı, 1 saat TTL, fingerprint ile tek kullanım).
 * ADMIN_SESSION_SECRET vitest.config.ts'te test değeriyle set edilir.
 */
const USER_ID = "user_123";
const PASSWORD_HASH = "abcdef0123456789_geri_kalan_hash_kismi";

describe("createResetToken / verifyResetToken", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  describe("Happy path", () => {
    it("üretilen token doğrulanır ve payload döner", () => {
      const token = createResetToken(USER_ID, PASSWORD_HASH);
      const payload = verifyResetToken(token);

      expect(payload).not.toBeNull();
      expect(payload?.userId).toBe(USER_ID);
      // fingerprint = hash'in ilk 16 karakteri
      expect(payload?.fp).toBe(PASSWORD_HASH.slice(0, 16));
    });

    it("token 'payload.signature' formatındadır", () => {
      const token = createResetToken(USER_ID, PASSWORD_HASH);
      expect(token.split(".")).toHaveLength(2);
    });
  });

  describe("Error handling", () => {
    it("boş string'i reddeder", () => {
      expect(verifyResetToken("")).toBeNull();
    });

    it("imzasız (nokta yok) token'ı reddeder", () => {
      expect(verifyResetToken("sadecepayload")).toBeNull();
    });

    it("kurcalanmış imzayı reddeder", () => {
      const token = createResetToken(USER_ID, PASSWORD_HASH);
      const [payload] = token.split(".");
      const tampered = `${payload}.sahte_imza_degeri`;
      expect(verifyResetToken(tampered)).toBeNull();
    });

    it("kurcalanmış payload'ı reddeder (imza tutmaz)", () => {
      const token = createResetToken(USER_ID, PASSWORD_HASH);
      const [, sig] = token.split(".");
      const fakePayload = Buffer.from(
        JSON.stringify({ userId: "hacker", exp: Date.now() + 100000, fp: "x" }),
      ).toString("base64url");
      expect(verifyResetToken(`${fakePayload}.${sig}`)).toBeNull();
    });

    it("geçersiz base64 payload'da çökmeden null döner", () => {
      // imza doğru uzunlukta olsa bile JSON.parse patlarsa null
      expect(verifyResetToken("!!!.@@@")).toBeNull();
    });
  });

  describe("Edge cases — süre dolması", () => {
    it("1 saatten eski token'ı reddeder", () => {
      const token = createResetToken(USER_ID, PASSWORD_HASH);

      // Saati 2 saat ileri al → token süresi dolmuş olur
      vi.useFakeTimers();
      vi.setSystemTime(Date.now() + 2 * 60 * 60 * 1000);

      expect(verifyResetToken(token)).toBeNull();
    });

    it("süre dolmadan hemen önce hâlâ geçerlidir", () => {
      const token = createResetToken(USER_ID, PASSWORD_HASH);

      vi.useFakeTimers();
      vi.setSystemTime(Date.now() + 59 * 60 * 1000); // 59 dk sonra

      expect(verifyResetToken(token)).not.toBeNull();
    });
  });

  describe("Güvenlik — tek kullanım garantisi", () => {
    it("farklı password hash ile üretilen fingerprint farklıdır", () => {
      const t1 = createResetToken(USER_ID, "AAAA111122223333rest");
      const t2 = createResetToken(USER_ID, "BBBB444455556666rest");

      const p1 = verifyResetToken(t1);
      const p2 = verifyResetToken(t2);

      expect(p1?.fp).not.toBe(p2?.fp);
    });
  });
});
