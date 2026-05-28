import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PrismaOrderAdminRepository } from "@/server/infrastructure/database/repositories/prisma-order-admin.repository";
import {
  GetOrderAdminUseCase,
  UpdateOrderStatusUseCase,
} from "@/server/application/admin/orders/order-admin.use-cases";

const statusSchema = z.object({
  status: z.enum(["DRAFT", "PENDING_PAYMENT", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]),
});

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const repo = new PrismaOrderAdminRepository();
  const order = await new GetOrderAdminUseCase(repo).execute(id);
  if (!order) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  return NextResponse.json(order);
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const body = await request.json();
  const parsed = statusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const repo = new PrismaOrderAdminRepository();
  await new UpdateOrderStatusUseCase(repo).execute(id, parsed.data);
  return NextResponse.json({ success: true });
}
