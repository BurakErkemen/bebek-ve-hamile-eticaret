import { describe, it, expect } from "vitest";
import { registerSchema, loginSchema } from "./auth.validator";

describe("registerSchema", () => {
  const valid = {
    firstName: "Ali",
    lastName: "Veli",
    email: "ali@example.com",
    phone: "05551234567",
    password: "parola123",
  };

  describe("Happy path", () => {
    it("geçerli kaydı kabul eder", () => {
      expect(registerSchema.safeParse(valid).success).toBe(true);
    });

    it("telefon olmadan da geçerlidir (opsiyonel)", () => {
      const { phone, ...rest } = valid;
      void phone;
      expect(registerSchema.safeParse(rest).success).toBe(true);
    });

    it("baştaki/sondaki boşlukları temizler (trim)", () => {
      const parsed = registerSchema.parse({ ...valid, firstName: "  Ali  " });
      expect(parsed.firstName).toBe("Ali");
    });
  });

  describe("Error handling", () => {
    it("geçersiz e-posta formatını reddeder", () => {
      expect(
        registerSchema.safeParse({ ...valid, email: "gecersiz" }).success,
      ).toBe(false);
    });

    it("6 karakterden kısa parolayı reddeder", () => {
      expect(
        registerSchema.safeParse({ ...valid, password: "12345" }).success,
      ).toBe(false);
    });

    it("çok kısa ad'ı (1 karakter) reddeder", () => {
      expect(
        registerSchema.safeParse({ ...valid, firstName: "A" }).success,
      ).toBe(false);
    });

    it("boş objeyi reddeder", () => {
      expect(registerSchema.safeParse({}).success).toBe(false);
    });
  });

  describe("Edge cases", () => {
    it("80 karakter ad sınırını kabul, 81'i reddeder", () => {
      expect(
        registerSchema.safeParse({ ...valid, firstName: "a".repeat(80) }).success,
      ).toBe(true);
      expect(
        registerSchema.safeParse({ ...valid, firstName: "a".repeat(81) }).success,
      ).toBe(false);
    });

    it("100 karakterden uzun parolayı reddeder", () => {
      expect(
        registerSchema.safeParse({ ...valid, password: "a".repeat(101) }).success,
      ).toBe(false);
    });
  });
});

describe("loginSchema", () => {
  it("geçerli girişi kabul eder", () => {
    expect(
      loginSchema.safeParse({ email: "a@b.com", password: "x" }).success,
    ).toBe(true);
  });

  it("boş parolayı reddeder", () => {
    expect(
      loginSchema.safeParse({ email: "a@b.com", password: "" }).success,
    ).toBe(false);
  });

  it("eksik alanı reddeder", () => {
    expect(loginSchema.safeParse({ email: "a@b.com" }).success).toBe(false);
  });
});
