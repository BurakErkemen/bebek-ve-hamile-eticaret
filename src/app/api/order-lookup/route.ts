import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/server/infrastructure/rate-limit/rate-limiter";
import { TrackOrderUseCase } from "@/server/application/checkout/track-order.use-case";
import { PrismaOrderLookupRepository } from "@/server/infrastructure/database/repositories/prisma-order-lookup.repository";
import { orderLookupSchema } from "@/server/presentation/validators/order-lookup.validator";

export async function POST(request: NextRequest) {
  const limited = await rateLimit(request, { prefix: "order:lookup", windowSeconds: 60, maxRequests: 20 });
  if (limited) return limited;
  const body = await request.json().catch(() => null);
  const parsed = orderLookupSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Sipariş numarası ve e-posta gereklidir." },
      { status: 400 },
    );
  }

  const order = await new TrackOrderUseCase(
    new PrismaOrderLookupRepository(),
  ).execute(parsed.data.orderNumber, parsed.data.email);

  if (!order) {
    return NextResponse.json(
      { message: "Bu bilgilere ait bir sipariş bulunamadı." },
      { status: 404 },
    );
  }

  return NextResponse.json({ order });
}
