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

function createMerchantOid(orderNumber: string): string {
  const normalizedOrderNumber = orderNumber.replace(/[^A-Za-z0-9]/g, "");
  const randomPart = randomUUID().slice(0, 8).replace(/-/g, "");

  return `${normalizedOrderNumber}${randomPart}`.slice(0, 64);
}

export class PrismaPaytrPaymentRepository implements PaymentRepository {
  async initiatePaytrPayment(
    input: InitiatePaytrPaymentInput,
  ): Promise<InitiatePaytrPaymentResult> {
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
      throw new PaymentError(
        "Bu sipariş için ödeme başlatılamaz.",
        409,
      );
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

    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        merchantOid,
        status: OrderStatus.PENDING_PAYMENT,
        paymentStatus: PaymentStatus.PENDING,
      },
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
