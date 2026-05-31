import { createHmac, timingSafeEqual } from "node:crypto";

const TTL_MS = 60 * 60 * 1000; // 1 saat

function getSecret(): string {
  const s = process.env.ADMIN_SESSION_SECRET?.trim();
  if (!s) throw new Error("ADMIN_SESSION_SECRET tanımlı değil.");
  return s;
}

/** Şifre sıfırlama tokeni üret.
 *  Payload: { userId, exp, pwdFingerprint }
 *  pwdFingerprint: mevcut passwordHash'in ilk 16 karakteri —
 *  şifre değişince token geçersiz kalır (tek kullanım garantisi). */
export function createResetToken(userId: string, passwordHash: string): string {
  const payload = Buffer.from(
    JSON.stringify({
      userId,
      exp: Date.now() + TTL_MS,
      fp: passwordHash.slice(0, 16),
    }),
  ).toString("base64url");

  const sig = createHmac("sha256", getSecret())
    .update(payload)
    .digest("base64url");

  return `${payload}.${sig}`;
}

export type ResetTokenPayload = { userId: string; fp: string };

/** Token'ı doğrula ve payload döndür. Geçersizse null. */
export function verifyResetToken(token: string): ResetTokenPayload | null {
  const [payload, sig] = (token ?? "").split(".");
  if (!payload || !sig) return null;

  const expected = createHmac("sha256", getSecret()).update(payload).digest();
  const given = Buffer.from(sig, "base64url");

  if (expected.length !== given.length || !timingSafeEqual(expected, given)) {
    return null;
  }

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as {
      userId?: string;
      exp?: number;
      fp?: string;
    };

    if (
      typeof data.userId !== "string" ||
      typeof data.exp !== "number" ||
      typeof data.fp !== "string" ||
      data.exp < Date.now()
    ) {
      return null;
    }

    return { userId: data.userId, fp: data.fp };
  } catch {
    return null;
  }
}
