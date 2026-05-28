import type {
  OrderSummary,
  OrderSummaryPaymentStatus,
  OrderSummaryStatus,
} from "@/server/domain/entities/order-summary.entity";
import type { OrderLookupRepository } from "@/server/domain/repositories/order-lookup.repository";
import { prisma } from "@/server/infrastructure/database/prisma/prisma-client";

type OrderWithItems = NonNullable<
  Awaited<ReturnType<typeof findOrderWithItems>>
>;

function findOrderWithItems(where: { merchantOid: string } | { id: string }) {
  return prisma.order.findFirst({
    where,
    include: {
      items: {
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

function mapToSummary(order: OrderWithItems): OrderSummary {
  return {
    orderNumber: order.orderNumber,
    status: order.status as OrderSummaryStatus,
    paymentStatus: order.paymentStatus as OrderSummaryPaymentStatus,
    customerFirstName: order.customerFirstName,
    customerLastName: order.customerLastName,
    customerEmail: order.customerEmail,
    shippingCity: order.shippingCity,
    shippingDistrict: order.shippingDistrict,
    shippingAddressLine: order.shippingAddressLine,
    subtotal: Number(order.subtotal),
    shippingFee: Number(order.shippingFee),
    discountAmount: Number(order.discountAmount),
    totalAmount: Number(order.totalAmount),
    paymentFailureMessage: order.paymentFailureMessage,
    createdAt: order.createdAt,
    items: order.items.map((item) => ({
      productName: item.productName,
      variantLabel: item.variantLabel,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
      lineTotal: Number(item.lineTotal),
      imageUrl: item.imageUrl,
    })),
  };
}

export class PrismaOrderLookupRepository implements OrderLookupRepository {
  async findByMerchantOid(merchantOid: string): Promise<OrderSummary | null> {
    const order = await findOrderWithItems({ merchantOid });
    return order ? mapToSummary(order) : null;
  }

  async findByOrderNumberAndEmail(
    orderNumber: string,
    email: string,
  ): Promise<OrderSummary | null> {
    const order = await prisma.order.findFirst({
      where: {
        orderNumber: orderNumber.trim().toUpperCase(),
        customerEmail: {
          equals: email.trim(),
          mode: "insensitive",
        },
      },
      include: {
        items: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    return order ? mapToSummary(order) : null;
  }

  async listByCustomer({
    userId,
    email,
  }: {
    userId: string;
    email: string;
  }): Promise<OrderSummary[]> {
    const orders = await prisma.order.findMany({
      where: {
        status: { not: "DRAFT" },
        OR: [
          { userId },
          { customerEmail: { equals: email.trim(), mode: "insensitive" } },
        ],
      },
      include: {
        items: { orderBy: { createdAt: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    });

    return orders.map(mapToSummary);
  }
}
