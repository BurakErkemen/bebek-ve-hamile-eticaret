import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PrismaBannerAdminRepository } from "@/server/infrastructure/database/repositories/prisma-banner-admin.repository";
import {
  GetBannerAdminUseCase,
  UpdateBannerUseCase,
  DeleteBannerUseCase,
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

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const repo = new PrismaBannerAdminRepository();
  const banner = await new GetBannerAdminUseCase(repo).execute(id);
  if (!banner) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  return NextResponse.json(banner);
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const body = await request.json();
  const parsed = bannerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const repo = new PrismaBannerAdminRepository();
  await new UpdateBannerUseCase(repo).execute(id, parsed.data);
  return NextResponse.json({ success: true });
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const repo = new PrismaBannerAdminRepository();
  await new DeleteBannerUseCase(repo).execute(id);
  return NextResponse.json({ success: true });
}
