import { randomUUID } from "node:crypto";
import type {
  CreateDraftOrderInput,
  DraftOrderResult,
} from "@/server/domain/entities/draft-order.entity";
import type { CheckoutOrderRepository } from "@/server/domain/repositories/checkout-order.repository";
import { prisma } from "@/server/infrastructure/database/prisma/prisma-client";
import { CheckoutOrderError } from "@/shared/errors/checkout-order.error";

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

function moneyString(value: number): string {
  return roundMoney(value).toFixed(2);
}

function buildVariantLabel(variant: {
  size: string | null;
  colorName: string | null;
  sku: string;
}): string {
  const parts = [variant.size, variant.colorName].filter(Boolean);

  if (parts.length === 0) {
    return variant.sku;
  }

  return parts.join(" / ");
}

function createOrderNumber(): string {
  const datePart = new Date()
    .toISOString()
    .slice(0, 10)
    .replaceAll("-", "");

  const randomPart = randomUUID().slice(0, 8).toUpperCase();

  return `BH-${datePart}-${randomPart}`;
}

function mergeCartItems(
  items: CreateDraftOrderInput["items"],
): CreateDraftOrderInput["items"] {
  const mergedItems = new Map<string, number>();

  for (const item of items) {
    mergedItems.set(
      item.variantId,
      (mergedItems.get(item.variantId) ?? 0) + item.quantity,
    );
  }

  return Array.from(mergedItems.entries()).map(
    ([variantId, quantity]) => ({
      variantId,
      quantity,
    }),
  );
}

export class PrismaCheckoutOrderRepository
  implements CheckoutOrderRepository
{
  async createDraftOrder(
    input: CreateDraftOrderInput,
  ): Promise<DraftOrderResult> {
    const mergedItems = mergeCartItems(input.items);
    const variantIds = mergedItems.map((item) => item.variantId);

    return prisma.$transaction(async (transaction) => {
      const variants = await transaction.productVariant.findMany({
        where: {
          id: {
            in: variantIds,
          },
          isActive: true,
          product: {
            is: {
              isActive: true,
            },
          },
        },
        include: {
          product: {
            include: {
              images: {
                orderBy: {
                  sortOrder: "asc",
                },
              },
            },
          },
        },
      });

      if (variants.length !== variantIds.length) {
        throw new CheckoutOrderError(
          "Sepetteki ürünlerden biri artık satışta değil.",
          409,
        );
      }

      const variantMap = new Map(
        variants.map((variant) => [variant.id, variant]),
      );

      const orderItems = mergedItems.map((cartItem) => {
        const variant = variantMap.get(cartItem.variantId);

        if (!variant) {
          throw new CheckoutOrderError(
            "Sepetteki ürünlerden biri bulunamadı.",
            409,
          );
        }

        if (cartItem.quantity > variant.stockQuantity) {
          throw new CheckoutOrderError(
            `${variant.product.name} ürünü için yeterli stok yok.`,
            409,
          );
        }

        const unitPrice = Number(
          variant.price ?? variant.product.basePrice,
        );

        const compareAtPrice = variant.compareAtPrice
          ? Number(variant.compareAtPrice)
          : variant.product.compareAtPrice
            ? Number(variant.product.compareAtPrice)
            : undefined;

        const lineTotal = roundMoney(unitPrice * cartItem.quantity);

        const primaryImage =
          variant.product.images.find((image) => image.isPrimary) ??
          variant.product.images[0];

        return {
          productId: variant.product.id,
          variantId: variant.id,
          productName: variant.product.name,
          productSlug: variant.product.slug,
          sku: variant.sku,
          variantLabel: buildVariantLabel(variant),
          imageUrl: primaryImage?.url ?? null,
          unitPrice,
          compareAtPrice,
          quantity: cartItem.quantity,
          lineTotal,
        };
      });

      const subtotal = roundMoney(
        orderItems.reduce((total, item) => total + item.lineTotal, 0),
      );

      const shippingFee = 0;
      const discountAmount = 0;
      const totalAmount = roundMoney(
        subtotal + shippingFee - discountAmount,
      );

      const order = await transaction.order.create({
        data: {
          orderNumber: createOrderNumber(),

          customerFirstName: input.customer.firstName,
          customerLastName: input.customer.lastName,
          customerEmail: input.customer.email,
          customerPhone: input.customer.phone,

          shippingCountry: input.shippingAddress.country,
          shippingCity: input.shippingAddress.city,
          shippingDistrict: input.shippingAddress.district,
          shippingNeighborhood:
            input.shippingAddress.neighborhood || null,
          shippingPostalCode:
            input.shippingAddress.postalCode || null,
          shippingAddressLine: input.shippingAddress.addressLine,

          customerNote: input.note || null,

          subtotal: moneyString(subtotal),
          shippingFee: moneyString(shippingFee),
          discountAmount: moneyString(discountAmount),
          totalAmount: moneyString(totalAmount),

          items: {
            create: orderItems.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              productName: item.productName,
              productSlug: item.productSlug,
              sku: item.sku,
              variantLabel: item.variantLabel,
              imageUrl: item.imageUrl,
              unitPrice: moneyString(item.unitPrice),
              compareAtPrice:
                typeof item.compareAtPrice === "number"
                  ? moneyString(item.compareAtPrice)
                  : null,
              quantity: item.quantity,
              lineTotal: moneyString(item.lineTotal),
            })),
          },
        },
      });

      return {
        orderId: order.id,
        orderNumber: order.orderNumber,
        subtotal,
        shippingFee,
        discountAmount,
        totalAmount,
      };
    });
  }
}
