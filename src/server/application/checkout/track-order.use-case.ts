import type { OrderSummary } from "@/server/domain/entities/order-summary.entity";
import type { OrderLookupRepository } from "@/server/domain/repositories/order-lookup.repository";

export class TrackOrderUseCase {
  constructor(
    private readonly orderLookupRepository: OrderLookupRepository,
  ) {}

  async execute(
    orderNumber: string,
    email: string,
  ): Promise<OrderSummary | null> {
    const normalizedOrderNumber = orderNumber.trim();
    const normalizedEmail = email.trim();

    if (!normalizedOrderNumber || !normalizedEmail) {
      return null;
    }

    return this.orderLookupRepository.findByOrderNumberAndEmail(
      normalizedOrderNumber,
      normalizedEmail,
    );
  }
}
