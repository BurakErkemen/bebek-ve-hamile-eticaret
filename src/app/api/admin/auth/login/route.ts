import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit } from "@/server/infrastructure/rate-limit/rate-limiter";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  createSessionToken,
} from "@/server/infrastructure/auth/session";

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

function constantTimeEquals(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let mismatch = 0;
  for (let index = 0; index < a.length; index += 1) {
    mismatch |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }
  return mismatch === 0;
}

export async function POST(request: NextRequest) {
  // Admin paneli brute-force koruması: 5 dk'da en fazla 5 deneme.
  const limited = await rateLimit(request, {
    prefix: "admin:login",
    windowSeconds: 300,
    maxRequests: 5,
  });
  if (limited) return limited;

  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const expectedUsername = process.env.ADMIN_USERNAME?.trim();
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedUsername || !expectedPassword) {
    return NextResponse.json(
      { error: "Admin kimlik bilgileri yapılandırılmamış." },
      { status: 500 },
    );
  }

  const usernameMatches = constantTimeEquals(
    parsed.data.username,
    expectedUsername,
  );
  const passwordMatches = constantTimeEquals(
    parsed.data.password,
    expectedPassword,
  );

  if (!usernameMatches || !passwordMatches) {
    return NextResponse.json(
      { error: "Kullanıcı adı veya parola hatalı." },
      { status: 401 },
    );
  }

  const token = await createSessionToken();
  const response = NextResponse.json({ ok: true });

  response.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE,
  });

  return response;
}
