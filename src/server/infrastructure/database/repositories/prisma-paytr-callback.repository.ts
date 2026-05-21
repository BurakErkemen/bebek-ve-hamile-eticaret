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
        for (const item of order.items) {
          if (!item.variantId) {
            continue;
          }

          const variant = await transaction.productVariant.findUnique({
            where: {
              id: item.variantId,
            },
            select: {
              id: true,
              stockQuantity: true,
              sku: true,
            },
          });

          if (!variant) {
            throw new PaymentError(
              `${item.sku} varyantı bulunamadı.`,
              409,
            );
          }

          if (variant.stockQuantity < item.quantity) {
            throw new PaymentError(
              `${item.sku} varyantı için yeterli stok yok.`,
              409,
            );
          }

          await transaction.productVariant.update({
            where: {
              id: variant.id,
            },
            data: {
              stockQuantity: {
                decrement: item.quantity,
              },
            },
          });
        }

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
