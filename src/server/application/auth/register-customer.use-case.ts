import type {
  Customer,
  RegisterCustomerInput,
} from "@/server/domain/entities/customer.entity";
import type { CustomerRepository } from "@/server/domain/repositories/customer.repository";
import { hashPassword } from "@/server/infrastructure/auth/password";
import { AuthError } from "@/shared/errors/auth.error";

export class RegisterCustomerUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(input: RegisterCustomerInput): Promise<Customer> {
    const existing = await this.customerRepository.findByEmail(input.email);
    if (existing) {
      throw new AuthError("Bu e-posta ile zaten bir hesap mevcut.", 409);
    }

    const passwordHash = hashPassword(input.password);

    return this.customerRepository.create({
      email: input.email,
      passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone,
    });
  }
}
