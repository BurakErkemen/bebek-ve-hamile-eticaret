import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PrismaHomeSectionAdminRepository } from "@/server/infrastructure/database/repositories/prisma-home-section-admin.repository";
import {
  UpdateHomeSectionItemUseCase,
  DeleteHomeSectionItemUseCase,
} from "@/server/application/admin/home-sections/home-section-admin.use-cases";

const itemSchema = z.object({
  itemType: z.enum(["CATEGORY_CARD", "CUSTOM_LINK", "PRODUCT_REFERENCE"]),
  categoryId: z.string().optional(),
  productId: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  href: z.string().optional(),
  badge: z.string().optional(),
  tone: z.enum(["ROSE", "SAGE", "PEACH"]),
  isActive: z.boolean(),
  sortOrder: z.number().int(),
});

type RouteParams = { params: Promise<{ id: string; itemId: string }> };

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { itemId } = await params;
  const body = await request.json();
  const parsed = itemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const repo = new PrismaHomeSectionAdminRepository();
  await new UpdateHomeSectionItemUseCase(repo).execute(itemId, parsed.data);
  return NextResponse.json({ success: true });
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const { itemId } = await params;
  const repo = new PrismaHomeSectionAdminRepository();
  await new DeleteHomeSectionItemUseCase(repo).execute(itemId);
  return NextResponse.json({ success: true });
}
