import { describe, it, expect, vi, beforeEach } from "vitest";
import { LoginCustomerUseCase } from "./login-customer.use-case";
import { hashPassword } from "@/server/infrastructure/auth/password";
import { AuthError } from "@/shared/errors/auth.error";
import type { CustomerRepository } from "@/server/domain/repositories/customer.repository";
import type { CustomerWithPassword } from "@/server/domain/entities/customer.entity";

/**
 * CustomerRepository tamamen mock'lanır — DB'ye dokunmadan use-case
 * mantığını izole test ederiz. Vitest mock fonksiyonları her testte sıfırlanır.
 */
function createMockRepository(): CustomerRepository {
  return {
    findByEmail: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    updateProfile: vi.fn(),
    updatePassword: vi.fn(),
  };
}

const SAMPLE_CUSTOMER: CustomerWithPassword = {
  id: "cust_1",
  email: "ayse@example.com",
  firstName: "Ayşe",
  lastName: "Yılmaz",
  phone: "05551112233",
  passwordHash: hashPassword("dogruParola"),
};

describe("LoginCustomerUseCase", () => {
  let repo: CustomerRepository;
  let useCase: LoginCustomerUseCase;

  beforeEach(() => {
    repo = createMockRepository();
    useCase = new LoginCustomerUseCase(repo);
  });

  describe("Happy path", () => {
    it("doğru kimlik bilgileriyle müşteriyi döner (parola hash'i HARİÇ)", async () => {
      vi.mocked(repo.findByEmail).mockResolvedValue(SAMPLE_CUSTOMER);

      const result = await useCase.execute("ayse@example.com", "dogruParola");

      expect(result).toEqual({
        id: "cust_1",
        email: "ayse@example.com",
        firstName: "Ayşe",
        lastName: "Yılmaz",
        phone: "05551112233",
      });
      // passwordHash sızdırılmamalı
      expect(result).not.toHaveProperty("passwordHash");
    });

    it("repository'i verilen e-posta ile çağırır", async () => {
      vi.mocked(repo.findByEmail).mockResolvedValue(SAMPLE_CUSTOMER);
      await useCase.execute("ayse@example.com", "dogruParola");
      expect(repo.findByEmail).toHaveBeenCalledWith("ayse@example.com");
    });
  });

  describe("Error handling", () => {
    it("kullanıcı bulunamazsa 401 AuthError fırlatır", async () => {
      vi.mocked(repo.findByEmail).mockResolvedValue(null);

      await expect(
        useCase.execute("yok@example.com", "herhangi"),
      ).rejects.toMatchObject({ statusCode: 401 });
    });

    it("parola yanlışsa 401 AuthError fırlatır", async () => {
      vi.mocked(repo.findByEmail).mockResolvedValue(SAMPLE_CUSTOMER);

      await expect(
        useCase.execute("ayse@example.com", "yanlisParola"),
      ).rejects.toBeInstanceOf(AuthError);
    });

    it("kullanıcı yok ve parola yanlış aynı mesajı verir (enumeration önlemi)", async () => {
      async function captureError(email: string, pw: string): Promise<AuthError> {
        try {
          await useCase.execute(email, pw);
          throw new Error("Hata bekleniyordu ama fırlatılmadı");
        } catch (e) {
          return e as AuthError;
        }
      }

      vi.mocked(repo.findByEmail).mockResolvedValueOnce(null);
      const errNoUser = await captureError("yok@example.com", "x");

      vi.mocked(repo.findByEmail).mockResolvedValueOnce(SAMPLE_CUSTOMER);
      const errBadPw = await captureError("ayse@example.com", "yanlis");

      expect(errNoUser.message).toBe(errBadPw.message);
    });
  });
});
