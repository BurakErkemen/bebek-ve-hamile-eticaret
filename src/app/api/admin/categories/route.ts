import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { revalidateTag } from "next/cache";
import { PrismaCategoryAdminRepository } from "@/server/infrastructure/database/repositories/prisma-category-admin.repository";
import {
  ListCategoriesUseCase,
  CreateCategoryUseCase,
} from "@/server/application/admin/categories/category-admin.use-cases";

const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  parentId: z.string().optional(),
  isActive: z.boolean(),
  sortOrder: z.number().int(),
});

export async function GET() {
  const repo = new PrismaCategoryAdminRepository();
  const categories = await new ListCategoriesUseCase(repo).execute();
  return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const repo = new PrismaCategoryAdminRepository();
  const result = await new CreateCategoryUseCase(repo).execute(parsed.data);
  revalidateTag("categories", {});
  return NextResponse.json(result, { status: 201 });
}
