import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { revalidateTag } from "next/cache";
import { PrismaBlogPostRepository } from "@/server/infrastructure/database/repositories/prisma-blog-post.repository";
import { GetBlogPostUseCase, UpdateBlogPostUseCase, DeleteBlogPostUseCase } from "@/server/application/admin/blog/blog-post.use-cases";

const blogPostSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  excerpt: z.string().nullable(),
  content: z.string(),
  coverImageUrl: z.string().nullable(),
  coverImageAlt: z.string().nullable(),
  isPublished: z.boolean(),
  publishedAt: z.string().datetime().nullable().transform((v) => (v ? new Date(v) : null)),
  sortOrder: z.number().int(),
});

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const repo = new PrismaBlogPostRepository();
  const post = await new GetBlogPostUseCase(repo).execute(id);
  if (!post) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const body = await request.json();
  const parsed = blogPostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const repo = new PrismaBlogPostRepository();
  await new UpdateBlogPostUseCase(repo).execute(id, parsed.data);
  revalidateTag("blog", {});
  return NextResponse.json({ success: true });
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const repo = new PrismaBlogPostRepository();
  await new DeleteBlogPostUseCase(repo).execute(id);
  revalidateTag("blog", {});
  return NextResponse.json({ success: true });
}
