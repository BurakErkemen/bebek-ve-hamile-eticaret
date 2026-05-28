import type { OrderSummary } from "@/server/domain/entities/order-summary.entity";

export interface OrderLookupRepository {
  findByMerchantOid(merchantOid: string): Promise<OrderSummary | null>;
  findByOrderNumberAndEmail(
    orderNumber: string,
    email: string,
  ): Promise<OrderSummary | null>;
  listByCustomer(params: {
    userId: string;
    email: string;
  }): Promise<OrderSummary[]>;
}
