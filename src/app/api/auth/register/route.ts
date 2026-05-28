import { NextResponse } from "next/server";
import { RegisterCustomerUseCase } from "@/server/application/auth/register-customer.use-case";
import { PrismaCustomerRepository } from "@/server/infrastructure/database/repositories/prisma-customer.repository";
import {
  CUSTOMER_SESSION_COOKIE,
  CUSTOMER_SESSION_MAX_AGE,
  createCustomerToken,
} from "@/server/infrastructure/auth/customer-session";
import { registerSchema } from "@/server/presentation/validators/auth.validator";
import { AuthError } from "@/shared/errors/auth.error";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Form bilgileri geçersiz." },
      { status: 400 },
    );
  }

  try {
    const customer = await new RegisterCustomerUseCase(
      new PrismaCustomerRepository(),
    ).execute(parsed.data);

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
