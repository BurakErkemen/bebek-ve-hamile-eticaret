import type { Customer } from "@/server/domain/entities/customer.entity";
import type { CustomerRepository } from "@/server/domain/repositories/customer.repository";
import { verifyPassword } from "@/server/infrastructure/auth/password";
import { AuthError } from "@/shared/errors/auth.error";

export class LoginCustomerUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(email: string, password: string): Promise<Customer> {
    const customer = await this.customerRepository.findByEmail(email);

    if (!customer || !verifyPassword(password, customer.passwordHash)) {
      throw new AuthError("E-posta veya parola hatalı.", 401);
    }

    return {
      id: customer.id,
      email: customer.email,
      firstName: customer.firstName,
      lastName: customer.lastName,
      phone: customer.phone,
    };
  }
}
