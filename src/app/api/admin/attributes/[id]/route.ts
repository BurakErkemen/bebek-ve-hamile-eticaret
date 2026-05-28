import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PrismaAttributeAdminRepository } from "@/server/infrastructure/database/repositories/prisma-attribute-admin.repository";
import {
  GetAttributeAdminUseCase,
  UpdateAttributeUseCase,
  DeleteAttributeUseCase,
} from "@/server/application/admin/attributes/attribute-admin.use-cases";

const attributeSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  displayType: z.enum(["CHECKBOX", "RADIO", "COLOR_SWATCH", "BADGE"]),
  isFilterable: z.boolean(),
  isVisibleOnProductDetail: z.boolean(),
  isActive: z.boolean(),
  sortOrder: z.number().int(),
});

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const repo = new PrismaAttributeAdminRepository();
  const attribute = await new GetAttributeAdminUseCase(repo).execute(id);
  if (!attribute) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  return NextResponse.json(attribute);
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const body = await request.json();
  const parsed = attributeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const repo = new PrismaAttributeAdminRepository();
  await new UpdateAttributeUseCase(repo).execute(id, parsed.data);
  return NextResponse.json({ success: true });
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const repo = new PrismaAttributeAdminRepository();
  await new DeleteAttributeUseCase(repo).execute(id);
  return NextResponse.json({ success: true });
}
