import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { rateLimit } from "@/server/infrastructure/rate-limit/rate-limiter";
import {
  CUSTOMER_SESSION_COOKIE,
  verifyCustomerToken,
} from "@/server/infrastructure/auth/customer-session";
import { PrismaCustomerRepository } from "@/server/infrastructure/database/repositories/prisma-customer.repository";

const profileSchema = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  phone: z.string().max(20).optional(),
});

async function getCustomerId(): Promise<string | null> {
  const jar = await cookies();
  const token = jar.get(CUSTOMER_SESSION_COOKIE)?.value;
  return verifyCustomerToken(token);
}

export async function PUT(request: NextRequest) {
  const limited = await rateLimit(request, {
    prefix: "auth:profile",
    windowSeconds: 60,
    maxRequests: 10,
  });
  if (limited) return limited;

  const customerId = await getCustomerId();
  if (!customerId) {
    return NextResponse.json({ message: "Oturum açmanız gerekiyor." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Geçersiz veriler.", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const repo = new PrismaCustomerRepository();
  const customer = await repo.updateProfile(customerId, parsed.data);
  return NextResponse.json({ customer });
}
