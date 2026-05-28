import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PrismaSliderAdminRepository } from "@/server/infrastructure/database/repositories/prisma-slider-admin.repository";
import {
  GetSliderAdminUseCase,
  UpdateSliderUseCase,
  DeleteSliderUseCase,
} from "@/server/application/admin/sliders/slider-admin.use-cases";

const sliderSchema = z.object({
  name: z.string().min(2),
  placement: z.enum(["HOME_HERO"]),
  isActive: z.boolean(),
  sortOrder: z.number().int(),
});

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const repo = new PrismaSliderAdminRepository();
  const slider = await new GetSliderAdminUseCase(repo).execute(id);
  if (!slider) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  return NextResponse.json(slider);
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const body = await request.json();
  const parsed = sliderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const repo = new PrismaSliderAdminRepository();
  await new UpdateSliderUseCase(repo).execute(id, parsed.data);
  return NextResponse.json({ success: true });
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const repo = new PrismaSliderAdminRepository();
  await new DeleteSliderUseCase(repo).execute(id);
  return NextResponse.json({ success: true });
}
