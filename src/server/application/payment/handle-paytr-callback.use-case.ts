import type {
  OrderConfirmationData,
  PaytrCallbackInput,
  PaytrCallbackResult,
} from "@/server/domain/entities/paytr-callback.entity";
import type { PaytrCallbackRepository } from "@/server/domain/repositories/paytr-callback.repository";

export interface OrderConfirmationMailer {
  sendOrderConfirmation(data: OrderConfirmationData): Promise<void>;
}

export class HandlePaytrCallbackUseCase {
  constructor(
    private readonly paytrCallbackRepository: PaytrCallbackRepository,
    private readonly mailer?: OrderConfirmationMailer,
  ) {}

  async execute(input: PaytrCallbackInput): Promise<PaytrCallbackResult> {
    const result = await this.paytrCallbackRepository.handleCallback(input);

    // Sipariş ilk kez ödendiyse onay e-postasını gönder. E-posta hatası,
    // PayTR'a dönecek "OK" yanıtını ASLA bloklamamalı (aksi halde PayTR
    // callback'i tekrar dener) — bu yüzden hata yutulur ve loglanır.
    if (this.mailer && result.orderConfirmation) {
      try {
        await this.mailer.sendOrderConfirmation(result.orderConfirmation);
      } catch (error) {
        console.error(
          "[paytr-callback] sipariş onay e-postası gönderilemedi:",
          error,
        );
      }
    }

    return result;
  }
}
