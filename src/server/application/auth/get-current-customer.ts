import { cookies } from "next/headers";
import type { Customer } from "@/server/domain/entities/customer.entity";
import {
  CUSTOMER_SESSION_COOKIE,
  verifyCustomerToken,
} from "@/server/infrastructure/auth/customer-session";
import { PrismaCustomerRepository } from "@/server/infrastructure/database/repositories/prisma-customer.repository";

export async function getCurrentCustomer(): Promise<Customer | null> {
  const token = (await cookies()).get(CUSTOMER_SESSION_COOKIE)?.value;
  const userId = verifyCustomerToken(token);

  if (!userId) {
    return null;
  }

  return new PrismaCustomerRepository().findById(userId);
}
