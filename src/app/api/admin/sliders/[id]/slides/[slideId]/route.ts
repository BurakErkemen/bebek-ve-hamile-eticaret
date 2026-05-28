import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PrismaSliderAdminRepository } from "@/server/infrastructure/database/repositories/prisma-slider-admin.repository";
import {
  UpdateSlideUseCase,
  DeleteSlideUseCase,
} from "@/server/application/admin/sliders/slider-admin.use-cases";

const slideSchema = z.object({
  eyebrow: z.string().optional(),
  title: z.string().min(1),
  description: z.string().optional(),
  primaryActionLabel: z.string().optional(),
  primaryActionHref: z.string().optional(),
  secondaryActionLabel: z.string().optional(),
  secondaryActionHref: z.string().optional(),
  imageUrl: z.string().optional(),
  imageAlt: z.string().optional(),
  tone: z.enum(["ROSE", "SAGE", "PEACH"]),
  isActive: z.boolean(),
  sortOrder: z.number().int(),
});

type RouteParams = { params: Promise<{ id: string; slideId: string }> };

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { slideId } = await params;
  const body = await request.json();
  const parsed = slideSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const repo = new PrismaSliderAdminRepository();
  await new UpdateSlideUseCase(repo).execute(slideId, parsed.data);
  return NextResponse.json({ success: true });
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const { slideId } = await params;
  const repo = new PrismaSliderAdminRepository();
  await new DeleteSlideUseCase(repo).execute(slideId);
  return NextResponse.json({ success: true });
}
