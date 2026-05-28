import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const from = process.env.RESEND_FROM_EMAIL ?? "bildirim@example.com";

export type OrderConfirmationPayload = {
  to: string;
  orderNumber: string;
  customerFirstName: string;
  totalAmount: string;
};

export async function sendOrderConfirmationEmail(
  payload: OrderConfirmationPayload
): Promise<void> {
  await resend.emails.send({
    from,
    to: payload.to,
    subject: `Siparişiniz alındı — #${payload.orderNumber}`,
    html: `
      <p>Merhaba ${payload.customerFirstName},</p>
      <p><strong>#${payload.orderNumber}</strong> numaralı siparişiniz başarıyla alındı.</p>
      <p>Toplam tutar: <strong>${payload.totalAmount} ₺</strong></p>
      <p>Siparişiniz hazırlandığında size bilgi vereceğiz.</p>
    `,
  });
}
