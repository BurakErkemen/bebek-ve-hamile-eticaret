import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PrismaAttributeAdminRepository } from "@/server/infrastructure/database/repositories/prisma-attribute-admin.repository";
import {
  UpdateAttributeValueUseCase,
  DeleteAttributeValueUseCase,
} from "@/server/application/admin/attributes/attribute-admin.use-cases";

const valueSchema = z.object({
  value: z.string().min(1),
  slug: z.string().min(1),
  colorHex: z.string().optional(),
  sortOrder: z.number().int(),
  isActive: z.boolean(),
});

type RouteParams = { params: Promise<{ id: string; valueId: string }> };

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { valueId } = await params;
  const body = await request.json();
  const parsed = valueSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const repo = new PrismaAttributeAdminRepository();
  await new UpdateAttributeValueUseCase(repo).execute(valueId, parsed.data);
  return NextResponse.json({ success: true });
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const { valueId } = await params;
  const repo = new PrismaAttributeAdminRepository();
  await new DeleteAttributeValueUseCase(repo).execute(valueId);
  return NextResponse.json({ success: true });
}
