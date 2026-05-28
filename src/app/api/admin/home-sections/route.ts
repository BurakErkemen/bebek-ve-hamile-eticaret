import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PrismaHomeSectionAdminRepository } from "@/server/infrastructure/database/repositories/prisma-home-section-admin.repository";
import {
  ListHomeSectionsUseCase,
  CreateHomeSectionUseCase,
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

export async function GET() {
  const repo = new PrismaHomeSectionAdminRepository();
  const sections = await new ListHomeSectionsUseCase(repo).execute();
  return NextResponse.json(sections);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = sectionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const repo = new PrismaHomeSectionAdminRepository();
  const result = await new CreateHomeSectionUseCase(repo).execute(parsed.data);
  return NextResponse.json(result, { status: 201 });
}
