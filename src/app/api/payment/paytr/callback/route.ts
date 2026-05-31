import { HandlePaytrCallbackUseCase } from "@/server/application/payment/handle-paytr-callback.use-case";
import { PrismaPaytrCallbackRepository } from "@/server/infrastructure/database/repositories/prisma-paytr-callback.repository";
import { ResendOrderConfirmationMailer } from "@/server/infrastructure/mail/resend-order-confirmation.mailer";
import { paytrCallbackRequestSchema } from "@/server/presentation/validators/payment.validator";
import { PaymentError } from "@/shared/errors/payment.error";

function okResponse() {
  return new Response("OK", {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

function errorResponse(message: string, status = 400) {
  return new Response(message, {
    status,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const payload = {
      merchant_oid: String(formData.get("merchant_oid") ?? ""),
      status: String(formData.get("status") ?? ""),
      total_amount: String(formData.get("total_amount") ?? ""),
      hash: String(formData.get("hash") ?? ""),
      failed_reason_code:
        formData.get("failed_reason_code") !== null
          ? String(formData.get("failed_reason_code"))
          : undefined,
      failed_reason_msg:
        formData.get("failed_reason_msg") !== null
          ? String(formData.get("failed_reason_msg"))
          : undefined,
    };

    const parsedPayload = paytrCallbackRequestSchema.safeParse(payload);

    if (!parsedPayload.success) {
      console.warn("PayTR callback validation failed:", parsedPayload.error.issues);
      return errorResponse("INVALID_CALLBACK_PAYLOAD", 400);
    }

    const paytrCallbackRepository = new PrismaPaytrCallbackRepository();
    const handlePaytrCallbackUseCase = new HandlePaytrCallbackUseCase(
      paytrCallbackRepository,
      new ResendOrderConfirmationMailer(),
    );

    await handlePaytrCallbackUseCase.execute({
      merchantOid: parsedPayload.data.merchant_oid,
      status: parsedPayload.data.status,
      totalAmount: parsedPayload.data.total_amount,
      hash: parsedPayload.data.hash,
      failedReasonCode: parsedPayload.data.failed_reason_code,
      failedReasonMessage: parsedPayload.data.failed_reason_msg,
    });

    return okResponse();
  } catch (error) {
    if (error instanceof PaymentError) {
      console.warn("PayTR callback rejected:", error.message);
      return errorResponse(error.message, error.statusCode);
    }

    console.error("PayTR callback failed:", error);
    return errorResponse("PAYTR_CALLBACK_FAILED", 500);
  }
}
