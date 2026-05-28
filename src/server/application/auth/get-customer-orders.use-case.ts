import type { OrderSummary } from "@/server/domain/entities/order-summary.entity";
import type { OrderLookupRepository } from "@/server/domain/repositories/order-lookup.repository";

export class GetCustomerOrdersUseCase {
  constructor(
    private readonly orderLookupRepository: OrderLookupRepository,
  ) {}

  async execute(userId: string, email: string): Promise<OrderSummary[]> {
    return this.orderLookupRepository.listByCustomer({ userId, email });
  }
}
