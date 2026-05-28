import { randomUUID } from "node:crypto";
import { OrderStatus, PaymentStatus } from "@/generated/prisma/client";
import type {
  InitiatePaytrPaymentInput,
  InitiatePaytrPaymentResult,
  PaymentRepository,
} from "@/server/domain/repositories/payment.repository";
import { prisma } from "@/server/infrastructure/database/prisma/prisma-client";
import { getPaytrConfig } from "@/server/infrastructure/payment/paytr/paytr.config";
import { PaytrIframeService } from "@/server/infrastructure/payment/paytr/paytr-iframe.service";
import { PaymentError } from "@/shared/errors/payment.error";

// PayTR ödeme oturumu en fazla ~30 dk (timeout_limit). Bu süreyi rahatça aşan
// rezervasyonlar terk edilmiş kabul edilir; stok geri bırakılır.
const RESERVATION_TIMEOUT_MS = 60 * 60 * 1000;

function createMerchantOid(orderNumber: string): string {
  const normalizedOrderNumber = orderNumber.replace(/[^A-Za-z0-9]/g, "");
  const randomPart = randomUUID().slice(0, 8).replace(/-/g, "");

  return `${normalizedOrderNumber}${randomPart}`.slice(0, 64);
}

export class PrismaPaytrPaymentRepository implements PaymentRepository {
  async initiatePaytrPayment(
    input: InitiatePaytrPaymentInput,
  ): Promise<InitiatePaytrPaymentResult> {
    await releaseExpiredReservations();

    const order = await prisma.order.findUnique({
      where: {
        id: input.orderId,
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new PaymentError("Sipariş bulunamadı.", 404);
    }

    if (
      order.status !== OrderStatus.DRAFT &&
      order.status !== OrderStatus.PENDING_PAYMENT
    ) {
      throw new PaymentError("Bu sipariş için ödeme başlatılamaz.", 409);
    }

    if (order.items.length === 0) {
      throw new PaymentError("Sipariş kalemi bulunamadı.", 409);
    }

    const merchantOid =
      order.merchantOid ?? createMerchantOid(order.orderNumber);

    let iframeToken: string;

    try {
      const paytrService = new PaytrIframeService(getPaytrConfig());

      iframeToken = await paytrService.createIframeToken({
        merchantOid,
        userIp: input.userIp,
        email: order.customerEmail,
        paymentAmount: Number(order.totalAmount),
        userName: `${order.customerFirstName} ${order.customerLastName}`,
        userAddress: [
          order.shippingNeighborhood,
          order.shippingAddressLine,
          order.shippingDistrict,
          order.shippingCity,
          order.shippingCountry,
        ]
          .filter(Boolean)
          .join(" "),
        userPhone: order.customerPhone,
        basketItems: order.items.map((item) => ({
          name: item.productName,
          unitPrice: Number(item.unitPrice),
          quantity: item.quantity,
        })),
      });
    } catch (error) {
      throw new PaymentError(
        error instanceof Error
          ? error.message
          : "PayTR token isteği başarısız oldu.",
        502,
      );
    }

    // Stok rezervasyonu: DRAFT -> PENDING_PAYMENT geçişinde stok atomik olarak
    // düşülür. Zaten PENDING_PAYMENT ise stok daha önce rezerve edilmiştir.
    await prisma.$transaction(async (transaction) => {
      const current = await transaction.order.findUnique({
        where: { id: order.id },
        select: { status: true },
      });

      if (!current) {
        throw new PaymentError("Sipariş bulunamadı.", 404);
      }

      if (current.status === OrderStatus.PENDING_PAYMENT) {
        await transaction.order.update({
          where: { id: order.id },
          data: { merchantOid, paymentStatus: PaymentStatus.PENDING },
        });
        return;
      }

      if (current.status !== OrderStatus.DRAFT) {
        throw new PaymentError("Bu sipariş için ödeme başlatılamaz.", 409);
      }

      for (const item of order.items) {
        if (!item.variantId) {
          continue;
        }

        const reservation = await transaction.productVariant.updateMany({
          where: {
            id: item.variantId,
            stockQuantity: { gte: item.quantity },
          },
          data: {
            stockQuantity: { decrement: item.quantity },
          },
        });

        if (reservation.count === 0) {
          throw new PaymentError(
            `${item.productName} için yeterli stok yok.`,
            409,
          );
        }
      }

      await transaction.order.update({
        where: { id: order.id },
        data: {
          merchantOid,
          status: OrderStatus.PENDING_PAYMENT,
          paymentStatus: PaymentStatus.PENDING,
        },
      });
    });

    return {
      orderId: order.id,
      orderNumber: order.orderNumber,
      merchantOid,
      iframeToken,
      iframeUrl: `https://www.paytr.com/odeme/guvenli/${iframeToken}`,
    };
  }
}

async function releaseExpiredReservations(): Promise<void> {
  const cutoff = new Date(Date.now() - RESERVATION_TIMEOUT_MS);

  const expiredOrders = await prisma.order.findMany({
    where: {
      status: OrderStatus.PENDING_PAYMENT,
      paymentStatus: PaymentStatus.PENDING,
      updatedAt: { lt: cutoff },
    },
    include: { items: true },
  });

  for (const expiredOrder of expiredOrders) {
    await prisma.$transaction(async (transaction) => {
      const fresh = await transaction.order.findUnique({
        where: { id: expiredOrder.id },
        select: { status: true, paymentStatus: true },
      });

      if (
        !fresh ||
        fresh.status !== OrderStatus.PENDING_PAYMENT ||
        fresh.paymentStatus !== PaymentStatus.PENDING
      ) {
        return;
      }

      for (const item of expiredOrder.items) {
        if (!item.variantId) {
          continue;
        }

        await transaction.productVariant.update({
          where: { id: item.variantId },
          data: { stockQuantity: { increment: item.quantity } },
        });
      }

      await transaction.order.update({
        where: { id: expiredOrder.id },
        data: {
          status: OrderStatus.CANCELLED,
          paymentStatus: PaymentStatus.FAILED,
          cancelledAt: new Date(),
          paymentFailureMessage:
            "Ödeme süresi doldu, sipariş otomatik olarak iptal edildi.",
        },
      });
    });
  }
}
