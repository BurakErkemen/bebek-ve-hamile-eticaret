import { NextRequest, NextResponse } from "next/server";
import { PrismaOrderAdminRepository } from "@/server/infrastructure/database/repositories/prisma-order-admin.repository";
import { ListOrdersUseCase } from "@/server/application/admin/orders/order-admin.use-cases";
import type { OrderAdminStatus } from "@/server/domain/entities/order-admin.entity";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const status = searchParams.get("status") as OrderAdminStatus | null;

  const repo = new PrismaOrderAdminRepository();
  const orders = await new ListOrdersUseCase(repo).execute(status ? { status } : undefined);
  return NextResponse.json(orders);
}
