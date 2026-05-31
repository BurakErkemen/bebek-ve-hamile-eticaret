import { Resend } from "resend";
import type { OrderConfirmationData } from "@/server/domain/entities/paytr-callback.entity";
import { formatTRY } from "@/shared/utils/format-currency";

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.RESEND_FROM_EMAIL ?? "bildirim@example.com";
const adminNotificationEmail = process.env.ADMIN_NOTIFICATION_EMAIL;

const resend = apiKey ? new Resend(apiKey) : null;

function renderOrderSummary(data: OrderConfirmationData): string {
  const rows = data.items
    .map(
      (item) =>
        `<tr>
           <td style="padding:8px;border-bottom:1px solid #eee;">${item.name}</td>
           <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
           <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">${formatTRY(item.unitPrice)}</td>
         </tr>`,
    )
    .join("");

  return `
    <table style="width:100%;border-collapse:collapse;margin:16px 0;">
      <thead>
        <tr>
          <th style="padding:8px;text-align:left;border-bottom:2px solid #d6336c;">Ürün</th>
          <th style="padding:8px;text-align:center;border-bottom:2px solid #d6336c;">Adet</th>
          <th style="padding:8px;text-align:right;border-bottom:2px solid #d6336c;">Birim Fiyat</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <div style="text-align:right;">
      <p style="margin:4px 0;">Ara toplam: ${formatTRY(data.subtotal)}</p>
      <p style="margin:4px 0;">Kargo: ${data.shippingFee === 0 ? "Ücretsiz" : formatTRY(data.shippingFee)}</p>
      <p style="margin:8px 0;font-size:18px;"><strong>Toplam: ${formatTRY(data.totalAmount)}</strong></p>
    </div>`;
}

export async function sendOrderConfirmationEmail(
  data: OrderConfirmationData,
): Promise<void> {
  if (!resend) {
    console.warn(
      "[resend] RESEND_API_KEY tanımlı değil — onay e-postası atlandı.",
    );
    return;
  }

  await resend.emails.send({
    from,
    to: data.to,
    subject: `Siparişiniz alındı — #${data.orderNumber}`,
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;color:#333;">
        <h1 style="color:#d6336c;">Siparişiniz alındı!</h1>
        <p>Merhaba ${data.customerFirstName} ${data.customerLastName},</p>
        <p><strong>#${data.orderNumber}</strong> numaralı siparişiniz başarıyla alındı ve hazırlanmaya başlıyor.</p>
        ${renderOrderSummary(data)}
        <p style="color:#666;margin-top:24px;">Siparişiniz kargoya verildiğinde size ayrıca bilgi vereceğiz.</p>
      </div>
    `,
  });
}

/**
 * Yeni (ödemesi alınmış) sipariş için admin'e bilgilendirme.
 * `ADMIN_NOTIFICATION_EMAIL` tanımlı değilse sessizce atlanır.
 */
export async function sendNewOrderAdminNotification(
  data: OrderConfirmationData,
): Promise<void> {
  if (!resend || !adminNotificationEmail) {
    return;
  }

  const items = data.items
    .map((item) => `<li>${item.name} × ${item.quantity}</li>`)
    .join("");

  await resend.emails.send({
    from,
    to: adminNotificationEmail,
    subject: `Yeni sipariş — #${data.orderNumber}`,
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;">
        <h2>Yeni sipariş: #${data.orderNumber}</h2>
        <p><strong>Müşteri:</strong> ${data.customerFirstName} ${data.customerLastName} (${data.to})</p>
        <ul>${items}</ul>
        <p><strong>Toplam:</strong> ${formatTRY(data.totalAmount)} (Kargo: ${formatTRY(data.shippingFee)})</p>
      </div>
    `,
  });
}
