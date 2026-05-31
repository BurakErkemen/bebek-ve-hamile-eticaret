import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/server/infrastructure/rate-limit/rate-limiter";
import { PrismaCustomerRepository } from "@/server/infrastructure/database/repositories/prisma-customer.repository";
import { verifyResetToken } from "@/server/infrastructure/auth/password-reset-token";
import { hashPassword } from "@/server/infrastructure/auth/password";

export async function POST(request: NextRequest) {
  const limited = await rateLimit(request, {
    prefix: "auth:reset-confirm",
    windowSeconds: 600,
    maxRequests: 10,
  });
  if (limited) return limited;

  const body = await request.json().catch(() => null) as {
    token?: string;
    password?: string;
  } | null;

  const token = body?.token;
  const password = body?.password;

  if (!token || typeof password !== "string" || password.length < 6) {
    return NextResponse.json(
      { message: "Geçersiz istek. Şifre en az 6 karakter olmalıdır." },
      { status: 400 },
    );
  }

  const payload = verifyResetToken(token);
  if (!payload) {
    return NextResponse.json(
      { message: "Bağlantı geçersiz veya süresi dolmuş." },
      { status: 400 },
    );
  }

  const repo = new PrismaCustomerRepository();
  const customer = await repo.findById(payload.userId);

  if (!customer) {
    return NextResponse.json({ message: "Kullanıcı bulunamadı." }, { status: 404 });
  }

  // Token'daki fingerprint mevcut hash ile eşleşmeli (tek kullanım)
  const customerWithPwd = await repo.findByEmail(customer.email);
  if (!customerWithPwd || customerWithPwd.passwordHash.slice(0, 16) !== payload.fp) {
    return NextResponse.json(
      { message: "Bağlantı zaten kullanıldı veya geçersiz." },
      { status: 400 },
    );
  }

  const passwordHash = hashPassword(password);
  await repo.updatePassword(payload.userId, passwordHash);

  return NextResponse.json({ message: "Şifreniz başarıyla güncellendi." });
}
