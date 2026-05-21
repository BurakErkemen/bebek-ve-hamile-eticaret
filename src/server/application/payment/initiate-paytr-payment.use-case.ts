import type {
  InitiatePaytrPaymentInput,
  InitiatePaytrPaymentResult,
  PaymentRepository,
} from "@/server/domain/repositories/payment.repository";

export class InitiatePaytrPaymentUseCase {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async execute(
    input: InitiatePaytrPaymentInput,
  ): Promise<InitiatePaytrPaymentResult> {
    return this.paymentRepository.initiatePaytrPayment(input);
  }
}
