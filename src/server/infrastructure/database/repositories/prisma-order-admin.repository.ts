import { prisma } from "../prisma/prisma-client";
import type { OrderAdminRepository } from "@/server/domain/repositories/order-admin.repository";
import type {
  OrderAdminListItem,
  OrderAdminDetail,
  OrderStatusUpdateInput,
  OrderAdminStatus,
} from "@/server/domain/entities/order-admin.entity";

export class PrismaOrderAdminRepository implements OrderAdminRepository {
  async listOrders(filter?: { status?: OrderAdminStatus }): Promise<OrderAdminListItem[]> {
    const rows = await prisma.order.findMany({
      where: filter?.status ? { status: filter.status } : undefined,
      include: {
        _count: { select: { items: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return rows.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      customerFirstName: o.customerFirstName,
      customerLastName: o.customerLastName,
      customerEmail: o.customerEmail,
      status: o.status as OrderAdminStatus,
      paymentStatus: o.paymentStatus as OrderAdminListItem["paymentStatus"],
      totalAmount: o.totalAmount.toString(),
      itemCount: o._count.items,
      createdAt: o.createdAt,
    }));
  }

  async findOrderById(id: string): Promise<OrderAdminDetail | null> {
    const o = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          orderBy: { createdAt: "asc" },
        },
      },
    });
    if (!o) return null;

    return {
      id: o.id,
      orderNumber: o.orderNumber,
      merchantOid: o.merchantOid,
      status: o.status as OrderAdminDetail["status"],
      paymentStatus: o.paymentStatus as OrderAdminDetail["paymentStatus"],
      paymentFailureCode: o.paymentFailureCode,
      paymentFailureMessage: o.paymentFailureMessage,
      paidAt: o.paidAt,
      cancelledAt: o.cancelledAt,
      customerFirstName: o.customerFirstName,
      customerLastName: o.customerLastName,
      customerEmail: o.customerEmail,
      customerPhone: o.customerPhone,
      shippingCountry: o.shippingCountry,
      shippingCity: o.shippingCity,
      shippingDistrict: o.shippingDistrict,
      shippingNeighborhood: o.shippingNeighborhood,
      shippingPostalCode: o.shippingPostalCode,
      shippingAddressLine: o.shippingAddressLine,
      customerNote: o.customerNote,
      subtotal: o.subtotal.toString(),
      shippingFee: o.shippingFee.toString(),
      discountAmount: o.discountAmount.toString(),
      totalAmount: o.totalAmount.toString(),
      items: o.items.map((item) => ({
        id: item.id,
        productName: item.productName,
        sku: item.sku,
        variantLabel: item.variantLabel,
        imageUrl: item.imageUrl,
        unitPrice: item.unitPrice.toString(),
        quantity: item.quantity,
        lineTotal: item.lineTotal.toString(),
      })),
      createdAt: o.createdAt,
      updatedAt: o.updatedAt,
    };
  }

  async updateOrderStatus(id: string, input: OrderStatusUpdateInput): Promise<void> {
    const data: Parameters<typeof prisma.order.update>[0]["data"] = {
      status: input.status,
    };
    if (input.status === "CANCELLED") {
      data.cancelledAt = new Date();
    }
    await prisma.order.update({ where: { id }, data });
  }
}
