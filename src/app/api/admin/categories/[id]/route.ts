import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { revalidateTag } from "next/cache";
import { PrismaCategoryAdminRepository } from "@/server/infrastructure/database/repositories/prisma-category-admin.repository";
import {
  GetCategoryAdminUseCase,
  UpdateCategoryUseCase,
  DeleteCategoryUseCase,
} from "@/server/application/admin/categories/category-admin.use-cases";

const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  parentId: z.string().optional(),
  isActive: z.boolean(),
  sortOrder: z.number().int(),
});

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const repo = new PrismaCategoryAdminRepository();
  const category = await new GetCategoryAdminUseCase(repo).execute(id);
  if (!category) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  return NextResponse.json(category);
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const body = await request.json();
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const repo = new PrismaCategoryAdminRepository();
  await new UpdateCategoryUseCase(repo).execute(id, parsed.data);
  revalidateTag("categories", {});
  return NextResponse.json({ success: true });
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const repo = new PrismaCategoryAdminRepository();
  await new DeleteCategoryUseCase(repo).execute(id);
  revalidateTag("categories", {});
  return NextResponse.json({ success: true });
}
