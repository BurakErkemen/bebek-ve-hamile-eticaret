import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PrismaHomeSectionAdminRepository } from "@/server/infrastructure/database/repositories/prisma-home-section-admin.repository";
import {
  GetHomeSectionAdminUseCase,
  UpdateHomeSectionUseCase,
  DeleteHomeSectionUseCase,
} from "@/server/application/admin/home-sections/home-section-admin.use-cases";

const sectionSchema = z.object({
  type: z.enum(["HERO_SLIDER", "CATEGORY_SHOWCASE", "PROMO_BANNER", "PRODUCT_SHOWCASE"]),
  eyebrow: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  actionLabel: z.string().optional(),
  actionHref: z.string().optional(),
  sliderId: z.string().optional(),
  bannerId: z.string().optional(),
  isActive: z.boolean(),
  sortOrder: z.number().int(),
});

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const repo = new PrismaHomeSectionAdminRepository();
  const section = await new GetHomeSectionAdminUseCase(repo).execute(id);
  if (!section) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  return NextResponse.json(section);
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const body = await request.json();
  const parsed = sectionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const repo = new PrismaHomeSectionAdminRepository();
  await new UpdateHomeSectionUseCase(repo).execute(id, parsed.data);
  return NextResponse.json({ success: true });
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const repo = new PrismaHomeSectionAdminRepository();
  await new DeleteHomeSectionUseCase(repo).execute(id);
  return NextResponse.json({ success: true });
}
