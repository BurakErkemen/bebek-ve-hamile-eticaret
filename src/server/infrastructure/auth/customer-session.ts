import { createHmac, timingSafeEqual } from "node:crypto";

export const CUSTOMER_SESSION_COOKIE = "customer_session";
export const CUSTOMER_SESSION_MAX_AGE = 60 * 60 * 24 * 30;

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET tanımlı değil.");
  }
  return secret;
}

export function createCustomerToken(userId: string): string {
  const payload = Buffer.from(
    JSON.stringify({
      userId,
      exp: Date.now() + CUSTOMER_SESSION_MAX_AGE * 1000,
    }),
  ).toString("base64url");

  const signature = createHmac("sha256", getSecret())
    .update(payload)
    .digest("base64url");

  return `${payload}.${signature}`;
}

export function verifyCustomerToken(
  token: string | undefined | null,
): string | null {
  if (!token) {
    return null;
  }

  const [payload, signature] = token.split(".");
  if (!payload || !signature) {
    return null;
  }

  const expected = createHmac("sha256", getSecret())
    .update(payload)
    .digest();
  const given = Buffer.from(signature, "base64url");

  if (expected.length !== given.length || !timingSafeEqual(expected, given)) {
    return null;
  }

  try {
    const data = JSON.parse(
      Buffer.from(payload, "base64url").toString(),
    ) as { userId?: string; exp?: number };

    if (typeof data.exp !== "number" || data.exp < Date.now()) {
      return null;
    }

    return typeof data.userId === "string" ? data.userId : null;
  } catch {
    return null;
  }
}
