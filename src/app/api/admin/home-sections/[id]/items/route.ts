import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PrismaHomeSectionAdminRepository } from "@/server/infrastructure/database/repositories/prisma-home-section-admin.repository";
import { CreateHomeSectionItemUseCase } from "@/server/application/admin/home-sections/home-section-admin.use-cases";

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

type RouteParams = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { id: sectionId } = await params;
  const body = await request.json();
  const parsed = itemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const repo = new PrismaHomeSectionAdminRepository();
  const result = await new CreateHomeSectionItemUseCase(repo).execute(sectionId, parsed.data);
  return NextResponse.json(result, { status: 201 });
}
