import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/server/infrastructure/rate-limit/rate-limiter";
import { PrismaCustomerRepository } from "@/server/infrastructure/database/repositories/prisma-customer.repository";
import { createResetToken } from "@/server/infrastructure/auth/password-reset-token";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const from = process.env.RESEND_FROM_EMAIL ?? "bildirim@dastini.com";
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function POST(request: NextRequest) {
  const limited = await rateLimit(request, {
    prefix: "auth:reset-request",
    windowSeconds: 3600,
    maxRequests: 3,
  });
  if (limited) return limited;

  const body = await request.json().catch(() => null) as { email?: string } | null;
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : null;

  if (!email) {
    return NextResponse.json({ message: "E-posta gereklidir." }, { status: 400 });
  }

  const repo = new PrismaCustomerRepository();
  const customer = await repo.findByEmail(email);

  // Güvenlik: kullanıcı bulunsun ya da bulunmasın aynı yanıtı ver
  if (customer && resend) {
    const token = createResetToken(customer.id, customer.passwordHash);
    const resetUrl = `${appUrl}/sifremi-unuttum/${encodeURIComponent(token)}`;

    await resend.emails.send({
      from,
      to: customer.email,
      subject: "Şifre Sıfırlama — Dastini",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#1C1917;">
          <h2 style="color:#C8722A;">Şifrenizi Sıfırlayın</h2>
          <p>Merhaba ${customer.firstName},</p>
          <p>Hesabınız için şifre sıfırlama talebinde bulundunuz. Aşağıdaki butona tıklayarak 1 saat içinde yeni şifrenizi belirleyebilirsiniz.</p>
          <a href="${resetUrl}"
             style="display:inline-block;margin:20px 0;background:#C8722A;color:#fff;padding:12px 28px;border-radius:999px;text-decoration:none;font-weight:700;">
            Şifremi Sıfırla
          </a>
          <p style="font-size:12px;color:#78716C;">Bu talebi siz yapmadıysanız bu e-postayı görmezden gelebilirsiniz.</p>
        </div>
      `,
    }).catch((err) => {
      console.error("[reset-password] e-posta gönderilemedi:", err);
    });
  }

  // Her durumda aynı mesaj (e-posta enumeration önlemi)
  return NextResponse.json({
    message: "E-postanız kayıtlıysa şifre sıfırlama bağlantısı gönderildi.",
  });
}
