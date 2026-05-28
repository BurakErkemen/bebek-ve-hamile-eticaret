import { OrderStatus, PaymentStatus } from "@/generated/prisma/client";
import type {
  PaytrCallbackInput,
  PaytrCallbackResult,
} from "@/server/domain/entities/paytr-callback.entity";
import type { PaytrCallbackRepository } from "@/server/domain/repositories/paytr-callback.repository";
import { prisma } from "@/server/infrastructure/database/prisma/prisma-client";
import { getPaytrConfig } from "@/server/infrastructure/payment/paytr/paytr.config";
import { PaytrCallbackService } from "@/server/infrastructure/payment/paytr/paytr-callback.service";
import { PaymentError } from "@/shared/errors/payment.error";

function paytrAmountToMoneyString(totalAmount: string): string {
  const amountAsNumber = Number(totalAmount);

  if (!Number.isFinite(amountAsNumber)) {
    throw new PaymentError("PayTR total_amount değeri geçersiz.", 400);
  }

  return (amountAsNumber / 100).toFixed(2);
}

export class PrismaPaytrCallbackRepository
  implements PaytrCallbackRepository
{
  async handleCallback(
    input: PaytrCallbackInput,
  ): Promise<PaytrCallbackResult> {
    const callbackService = new PaytrCallbackService(getPaytrConfig());

    const isHashValid = callbackService.verifyHash({
      merchantOid: input.merchantOid,
      status: input.status,
      totalAmount: input.totalAmount,
      receivedHash: input.hash,
    });

    if (!isHashValid) {
      throw new PaymentError("PayTR callback hash doğrulaması başarısız.", 403);
    }

    const paytrTotalAmount = paytrAmountToMoneyString(input.totalAmount);

    await prisma.$transaction(async (transaction) => {
      const order = await transaction.order.findUnique({
        where: {
          merchantOid: input.merchantOid,
        },
        include: {
          items: true,
        },
      });

      if (!order) {
        throw new PaymentError("Callback siparişi bulunamadı.", 404);
      }

      const isAlreadyFinalized =
        order.paymentStatus === PaymentStatus.SUCCESS ||
        order.paymentStatus === PaymentStatus.FAILED ||
        order.status === OrderStatus.PROCESSING ||
        order.status === OrderStatus.CANCELLED;

      if (isAlreadyFinalized) {
        return;
      }

      if (input.status === "success") {
        // Stok ödeme başlatılırken (initiate) rezerve edilmişti; burada yalnızca
        // siparişi kesinleştiriyoruz. Tekrar stok düşülmez.
        await transaction.order.update({
          where: {
            id: order.id,
          },
          data: {
            status: OrderStatus.PROCESSING,
            paymentStatus: PaymentStatus.SUCCESS,
            paytrTotalAmount,
            paidAt: new Date(),
          },
        });

        return;
      }

      // Ödeme başarısız: rezerve edilen stok geri bırakılır.
      if (order.status === OrderStatus.PENDING_PAYMENT) {
        for (const item of order.items) {
          if (!item.variantId) {
            continue;
          }

          await transaction.productVariant.update({
            where: {
              id: item.variantId,
            },
            data: {
              stockQuantity: {
                increment: item.quantity,
              },
            },
          });
        }
      }

      await transaction.order.update({
        where: {
          id: order.id,
        },
        data: {
          status: OrderStatus.CANCELLED,
          paymentStatus: PaymentStatus.FAILED,
          paytrTotalAmount,
          paymentFailureCode: input.failedReasonCode ?? null,
          paymentFailureMessage: input.failedReasonMessage ?? null,
          cancelledAt: new Date(),
        },
      });
    });

    return {
      shouldAcknowledge: true,
    };
  }
}
