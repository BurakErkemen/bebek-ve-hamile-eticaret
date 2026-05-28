import type {
  Customer,
  CustomerWithPassword,
} from "@/server/domain/entities/customer.entity";
import type { CustomerRepository } from "@/server/domain/repositories/customer.repository";
import { prisma } from "@/server/infrastructure/database/prisma/prisma-client";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export class PrismaCustomerRepository implements CustomerRepository {
  async findByEmail(email: string): Promise<CustomerWithPassword | null> {
    const user = await prisma.user.findUnique({
      where: { email: normalizeEmail(email) },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      passwordHash: user.passwordHash,
    };
  }

  async findById(id: string): Promise<Customer | null> {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
    };
  }

  async create(input: {
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }): Promise<Customer> {
    const user = await prisma.user.create({
      data: {
        email: normalizeEmail(input.email),
        passwordHash: input.passwordHash,
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone ?? null,
      },
    });

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
    };
  }
}
