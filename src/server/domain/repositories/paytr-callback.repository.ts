import type {
  PaytrCallbackInput,
  PaytrCallbackResult,
} from "../entities/paytr-callback.entity";

export interface PaytrCallbackRepository {
  handleCallback(input: PaytrCallbackInput): Promise<PaytrCallbackResult>;
}
