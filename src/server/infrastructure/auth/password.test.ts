import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "./password";

/**
 * scrypt tabanlı şifre hash'leme. Saf Node crypto kullanır — mock gerekmez.
 */
describe("hashPassword / verifyPassword", () => {
  describe("Happy path", () => {
    it("doğru parolayı doğrular", () => {
      const hash = hashPassword("GucluParola123");
      expect(verifyPassword("GucluParola123", hash)).toBe(true);
    });

    it("salt:key formatında çıktı üretir", () => {
      const hash = hashPassword("test");
      expect(hash).toMatch(/^[0-9a-f]+:[0-9a-f]+$/);
    });

    it("aynı parola için her seferinde FARKLI hash üretir (rastgele salt)", () => {
      const a = hashPassword("ayniParola");
      const b = hashPassword("ayniParola");
      expect(a).not.toBe(b);
      // ama ikisi de doğrulanır
      expect(verifyPassword("ayniParola", a)).toBe(true);
      expect(verifyPassword("ayniParola", b)).toBe(true);
    });
  });

  describe("Error handling & güvenlik", () => {
    it("yanlış parolayı reddeder", () => {
      const hash = hashPassword("dogruParola");
      expect(verifyPassword("yanlisParola", hash)).toBe(false);
    });

    it("bozuk hash formatını (iki nokta yok) reddeder", () => {
      expect(verifyPassword("parola", "gecersizhashformati")).toBe(false);
    });

    it("boş hash string'ini reddeder", () => {
      expect(verifyPassword("parola", "")).toBe(false);
    });

    it("yalnızca salt içeren (key eksik) hash'i reddeder", () => {
      expect(verifyPassword("parola", "abcdef:")).toBe(false);
    });
  });

  describe("Edge cases", () => {
    it("boş parolayı hash'ler ve doğrular", () => {
      const hash = hashPassword("");
      expect(verifyPassword("", hash)).toBe(true);
      expect(verifyPassword("x", hash)).toBe(false);
    });

    it("unicode ve emoji içeren parolayı destekler", () => {
      const pw = "şifre🔒çağrı";
      const hash = hashPassword(pw);
      expect(verifyPassword(pw, hash)).toBe(true);
    });

    it("çok uzun parolayı (1000 karakter) işler", () => {
      const pw = "a".repeat(1000);
      const hash = hashPassword(pw);
      expect(verifyPassword(pw, hash)).toBe(true);
    });
  });
});
