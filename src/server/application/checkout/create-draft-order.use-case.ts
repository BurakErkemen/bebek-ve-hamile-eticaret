import type {
  CreateDraftOrderInput,
  DraftOrderResult,
} from "@/server/domain/entities/draft-order.entity";
import type { CheckoutOrderRepository } from "@/server/domain/repositories/checkout-order.repository";

export class CreateDraftOrderUseCase {
  constructor(
    private readonly checkoutOrderRepository: CheckoutOrderRepository,
  ) {}

  async execute(
    input: CreateDraftOrderInput,
  ): Promise<DraftOrderResult> {
    return this.checkoutOrderRepository.createDraftOrder(input);
  }
}