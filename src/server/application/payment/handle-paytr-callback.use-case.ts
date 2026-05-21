import type {
  PaytrCallbackInput,
  PaytrCallbackResult,
} from "@/server/domain/entities/paytr-callback.entity";
import type { PaytrCallbackRepository } from "@/server/domain/repositories/paytr-callback.repository";

export class HandlePaytrCallbackUseCase {
  constructor(
    private readonly paytrCallbackRepository: PaytrCallbackRepository,
  ) {}

  async execute(
    input: PaytrCallbackInput,
  ): Promise<PaytrCallbackResult> {
    return this.paytrCallbackRepository.handleCallback(input);
  }
}
