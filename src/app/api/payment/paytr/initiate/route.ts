import { NextResponse } from "next/server";
import { InitiatePaytrPaymentUseCase } from "@/server/application/payment/initiate-paytr-payment.use-case";
import { PrismaPaytrPaymentRepository } from "@/server/infrastructure/database/repositories/prisma-paytr-payment.repository";
import { initiatePaytrPaymentRequestSchema } from "@/server/presentation/validators/payment.validator";
import { PaymentError } from "@/shared/errors/payment.error";
import { getClientIpFromRequest } from "@/shared/utils/request-ip";

export async function POST(request: Request) {
  try {
    const rawPayload = await request.json();
    const parsedPayload =
      initiatePaytrPaymentRequestSchema.safeParse(rawPayload);

    if (!parsedPayload.success) {
      return NextResponse.json(
        {
          message: "Ödeme başlatma isteği geçersiz.",
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

    const paymentRepository = new PrismaPaytrPaymentRepository();
    const initiatePaytrPaymentUseCase =
      new InitiatePaytrPaymentUseCase(paymentRepository);

    const payment = await initiatePaytrPaymentUseCase.execute({
      orderId: parsedPayload.data.orderId,
      userIp: getClientIpFromRequest(request),
    });

    return NextResponse.json(
      {
        message: "PayTR ödeme oturumu oluşturuldu.",
        payment,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    if (error instanceof PaymentError) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: error.statusCode,
        },
      );
    }

    console.error("PayTR initiate failed:", error);

    return NextResponse.json(
      {
        message: "PayTR ödeme oturumu oluşturulurken hata oluştu.",
      },
      {
        status: 500,
      },
    );
  }
}
