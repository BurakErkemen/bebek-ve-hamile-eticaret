import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { CreateDraftOrderUseCase } from "@/server/application/checkout/create-draft-order.use-case";
import { PrismaCheckoutOrderRepository } from "@/server/infrastructure/database/repositories/prisma-checkout-order.repository";
import {
  CUSTOMER_SESSION_COOKIE,
  verifyCustomerToken,
} from "@/server/infrastructure/auth/customer-session";
import { checkoutRequestSchema } from "@/server/presentation/validators/checkout.validator";
import { CheckoutOrderError } from "@/shared/errors/checkout-order.error";

export async function POST(request: Request) {
  try {
    const rawPayload = await request.json();
    const parsedPayload = checkoutRequestSchema.safeParse(rawPayload);

    if (!parsedPayload.success) {
      console.warn(
        "Checkout validation failed:",
        parsedPayload.error.issues,
      );

      return NextResponse.json(
        {
          message: "Checkout formu geçersiz.",
          issues: parsedPayload.error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        },
        {
          status: 400,
        },
      );
    }

    const sessionToken = (await cookies()).get(
      CUSTOMER_SESSION_COOKIE,
    )?.value;
    const userId = verifyCustomerToken(sessionToken) ?? undefined;

    const checkoutOrderRepository =
      new PrismaCheckoutOrderRepository();

    const createDraftOrderUseCase =
      new CreateDraftOrderUseCase(checkoutOrderRepository);

    const order = await createDraftOrderUseCase.execute({
      ...parsedPayload.data,
      userId,
    });

    return NextResponse.json(
      {
        message: "Taslak sipariş oluşturuldu.",
        order,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    if (error instanceof CheckoutOrderError) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: error.statusCode,
        },
      );
    }

    console.error("Checkout route failed:", error);

    return NextResponse.json(
      {
        message: "Sipariş oluşturulurken beklenmeyen bir hata oluştu.",
      },
      {
        status: 500,
      },
    );
  }
}
