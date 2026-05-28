import type { OrderSummary } from "@/server/domain/entities/order-summary.entity";
import type { OrderLookupRepository } from "@/server/domain/repositories/order-lookup.repository";

export class GetOrderSummaryUseCase {
  constructor(
    private readonly orderLookupRepository: OrderLookupRepository,
  ) {}

  async execute(merchantOid: string): Promise<OrderSummary | null> {
    const normalized = merchantOid.trim();
    if (!normalized) {
      return null;
    }
    return this.orderLookupRepository.findByMerchantOid(normalized);
  }
}
