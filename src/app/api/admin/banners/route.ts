import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PrismaBannerAdminRepository } from "@/server/infrastructure/database/repositories/prisma-banner-admin.repository";
import {
  ListBannersUseCase,
  CreateBannerUseCase,
} from "@/server/application/admin/banners/banner-admin.use-cases";

const bannerSchema = z.object({
  name: z.string().min(2),
  placement: z.enum(["HOME_PROMO", "CATEGORY_PROMO", "GLOBAL_PROMO"]),
  eyebrow: z.string().optional(),
  title: z.string().min(1),
  description: z.string().optional(),
  actionLabel: z.string().optional(),
  actionHref: z.string().optional(),
  imageUrl: z.string().optional(),
  imageAlt: z.string().optional(),
  tone: z.enum(["ROSE", "SAGE", "PEACH"]),
  isActive: z.boolean(),
  sortOrder: z.number().int(),
});

export async function GET() {
  const repo = new PrismaBannerAdminRepository();
  const banners = await new ListBannersUseCase(repo).execute();
  return NextResponse.json(banners);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = bannerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const repo = new PrismaBannerAdminRepository();
  const result = await new CreateBannerUseCase(repo).execute(parsed.data);
  return NextResponse.json(result, { status: 201 });
}
