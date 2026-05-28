import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { revalidateTag } from "next/cache";
import { PrismaPageRepository } from "@/server/infrastructure/database/repositories/prisma-page.repository";
import { UpsertPageBySlugUseCase } from "@/server/application/admin/pages/page.use-cases";
import { CORPORATE_PAGE_SLUGS } from "@/server/domain/entities/corporate-pages";

const pageSchema = z.object({
  title: z.string().min(2),
  slug: z.string().refine((s) => CORPORATE_PAGE_SLUGS.includes(s), "Geçersiz sayfa"),
  content: z.string(),
  isActive: z.boolean(),
  sortOrder: z.number().int(),
});

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const parsed = pageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const repo = new PrismaPageRepository();
  await new UpsertPageBySlugUseCase(repo).execute(parsed.data.slug, parsed.data);
  revalidateTag("pages", {});
  return NextResponse.json({ success: true });
}
