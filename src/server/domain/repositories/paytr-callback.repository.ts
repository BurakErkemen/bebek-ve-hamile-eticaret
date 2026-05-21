import type {
  PaytrCallbackInput,
  PaytrCallbackResult,
} from "@/server/domain/entities/paytr-callback.entity";

export interface PaytrCallbackRepository {
  handleCallback(
    input: PaytrCallbackInput,
  ): Promise<PaytrCallbackResult>;
}
