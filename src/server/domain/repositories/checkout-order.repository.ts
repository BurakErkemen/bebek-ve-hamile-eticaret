import type {
  CreateDraftOrderInput,
  DraftOrderResult,
} from "@/server/domain/entities/draft-order.entity";

export interface CheckoutOrderRepository {
  createDraftOrder(
    input: CreateDraftOrderInput,
  ): Promise<DraftOrderResult>;
}