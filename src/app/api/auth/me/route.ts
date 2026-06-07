import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/server/infrastructure/rate-limit/rate-limiter";
import { getCurrentCustomer } from "@/server/application/auth/get-current-customer";

export async function GET(request: NextRequest) {
  // Hafif abuse koruması — bu uç her sayfa yüklemede çağrılır.
  const limited = await rateLimit(request, {
    prefix: "auth:me",
    windowSeconds: 60,
    maxRequests: 60,
  });
  if (limited) return limited;

  const customer = await getCurrentCustomer();
  return NextResponse.json({ customer });
}
