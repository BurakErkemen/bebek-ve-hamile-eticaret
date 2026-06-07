import { describe, it, expect, vi, beforeEach } from "vitest";
import { RegisterCustomerUseCase } from "./register-customer.use-case";
import { verifyPassword } from "@/server/infrastructure/auth/password";
import { AuthError } from "@/shared/errors/auth.error";
import type { CustomerRepository } from "@/server/domain/repositories/customer.repository";
import type {
  Customer,
  CustomerWithPassword,
  RegisterCustomerInput,
} from "@/server/domain/entities/customer.entity";

function createMockRepository(): CustomerRepository {
  return {
    findByEmail: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    updateProfile: vi.fn(),
    updatePassword: vi.fn(),
  };
}

const VALID_INPUT: RegisterCustomerInput = {
  email: "yeni@example.com",
  password: "parola123",
  firstName: "Mehmet",
  lastName: "Demir",
  phone: "05559998877",
};

describe("RegisterCustomerUseCase", () => {
  let repo: CustomerRepository;
  let useCase: RegisterCustomerUseCase;

  beforeEach(() => {
    repo = createMockRepository();
    useCase = new RegisterCustomerUseCase(repo);
  });

  describe("Happy path", () => {
    it("yeni e-posta ile müşteri oluşturur", async () => {
      vi.mocked(repo.findByEmail).mockResolvedValue(null);
      const created: Customer = {
        id: "new_1",
        email: VALID_INPUT.email,
        firstName: VALID_INPUT.firstName,
        lastName: VALID_INPUT.lastName,
        phone: VALID_INPUT.phone ?? null,
      };
      vi.mocked(repo.create).mockResolvedValue(created);

      const result = await useCase.execute(VALID_INPUT);

      expect(result).toEqual(created);
      expect(repo.create).toHaveBeenCalledOnce();
    });

    it("parolayı düz metin DEĞİL, hash'lenmiş olarak kaydeder", async () => {
      vi.mocked(repo.findByEmail).mockResolvedValue(null);
      vi.mocked(repo.create).mockResolvedValue({} as Customer);

      await useCase.execute(VALID_INPUT);

      const createArg = vi.mocked(repo.create).mock.calls[0][0];
      // Düz parola asla kaydedilmemeli
      expect(createArg.passwordHash).not.toBe(VALID_INPUT.password);
      // Hash, orijinal parolayı doğrulayabilmeli
      expect(verifyPassword(VALID_INPUT.password, createArg.passwordHash)).toBe(true);
    });
  });

  describe("Error handling", () => {
    it("e-posta zaten kayıtlıysa 409 AuthError fırlatır", async () => {
      vi.mocked(repo.findByEmail).mockResolvedValue({
        id: "existing",
      } as CustomerWithPassword);

      await expect(useCase.execute(VALID_INPUT)).rejects.toMatchObject({
        statusCode: 409,
      });
      // Çakışma varsa create çağrılmamalı
      expect(repo.create).not.toHaveBeenCalled();
    });

    it("fırlatılan hata AuthError tipindedir", async () => {
      vi.mocked(repo.findByEmail).mockResolvedValue({} as CustomerWithPassword);
      await expect(useCase.execute(VALID_INPUT)).rejects.toBeInstanceOf(AuthError);
    });
  });

  describe("Edge cases", () => {
    it("telefon opsiyoneldir — telefonsuz kayıt çalışır", async () => {
      vi.mocked(repo.findByEmail).mockResolvedValue(null);
      vi.mocked(repo.create).mockResolvedValue({} as Customer);

      const { phone, ...withoutPhone } = VALID_INPUT;
      void phone;
      await useCase.execute(withoutPhone);

      const createArg = vi.mocked(repo.create).mock.calls[0][0];
      expect(createArg.phone).toBeUndefined();
    });
  });
});
