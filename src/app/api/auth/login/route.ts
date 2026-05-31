import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/server/infrastructure/rate-limit/rate-limiter";
import { LoginCustomerUseCase } from "@/server/application/auth/login-customer.use-case";
import { PrismaCustomerRepository } from "@/server/infrastructure/database/repositories/prisma-customer.repository";
import {
  CUSTOMER_SESSION_COOKIE,
  CUSTOMER_SESSION_MAX_AGE,
  createCustomerToken,
} from "@/server/infrastructure/auth/customer-session";
import { loginSchema } from "@/server/presentation/validators/auth.validator";
import { AuthError } from "@/shared/errors/auth.error";

export async function POST(request: NextRequest) {
  const limited = await rateLimit(request, { prefix: "auth:login", windowSeconds: 60, maxRequests: 10 });
  if (limited) return limited;

  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "E-posta ve parola gereklidir." },
      { status: 400 },
    );
  }

  try {
    const customer = await new LoginCustomerUseCase(
      new PrismaCustomerRepository(),
    ).execute(parsed.data.email, parsed.data.password);

    const token = createCustomerToken(customer.id);
    const response = NextResponse.json({ customer });

    response.cookies.set(CUSTOMER_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: CUSTOMER_SESSION_MAX_AGE,
    });

    return response;
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.statusCode },
      );
    }
    throw error;
  }
}
