import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PrismaAttributeAdminRepository } from "@/server/infrastructure/database/repositories/prisma-attribute-admin.repository";
import { CreateAttributeValueUseCase } from "@/server/application/admin/attributes/attribute-admin.use-cases";

const valueSchema = z.object({
  value: z.string().min(1),
  slug: z.string().min(1),
  colorHex: z.string().optional(),
  sortOrder: z.number().int(),
  isActive: z.boolean(),
});

type RouteParams = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { id: attributeId } = await params;
  const body = await request.json();
  const parsed = valueSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const repo = new PrismaAttributeAdminRepository();
  const result = await new CreateAttributeValueUseCase(repo).execute(attributeId, parsed.data);
  return NextResponse.json(result, { status: 201 });
}
