import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PrismaSliderAdminRepository } from "@/server/infrastructure/database/repositories/prisma-slider-admin.repository";
import {
  ListSlidersUseCase,
  CreateSliderUseCase,
} from "@/server/application/admin/sliders/slider-admin.use-cases";

const sliderSchema = z.object({
  name: z.string().min(2),
  placement: z.enum(["HOME_HERO"]),
  isActive: z.boolean(),
  sortOrder: z.number().int(),
});

export async function GET() {
  const repo = new PrismaSliderAdminRepository();
  const sliders = await new ListSlidersUseCase(repo).execute();
  return NextResponse.json(sliders);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = sliderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const repo = new PrismaSliderAdminRepository();
  const result = await new CreateSliderUseCase(repo).execute(parsed.data);
  return NextResponse.json(result, { status: 201 });
}
