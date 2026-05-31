import type { OrderConfirmationData } from "@/server/domain/entities/paytr-callback.entity";
import type { OrderConfirmationMailer } from "@/server/application/payment/handle-paytr-callback.use-case";
import {
  sendNewOrderAdminNotification,
  sendOrderConfirmationEmail,
} from "./resend.service";

export class ResendOrderConfirmationMailer implements OrderConfirmationMailer {
  async sendOrderConfirmation(data: OrderConfirmationData): Promise<void> {
    await Promise.all([
      sendOrderConfirmationEmail(data),
      sendNewOrderAdminNotification(data),
    ]);
  }
}
