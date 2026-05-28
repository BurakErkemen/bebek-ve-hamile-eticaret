import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { revalidateTag } from "next/cache";
import { PrismaBlogPostRepository } from "@/server/infrastructure/database/repositories/prisma-blog-post.repository";
import { ListBlogPostsUseCase, CreateBlogPostUseCase } from "@/server/application/admin/blog/blog-post.use-cases";

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

export async function GET() {
  const repo = new PrismaBlogPostRepository();
  const posts = await new ListBlogPostsUseCase(repo).execute();
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = blogPostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const repo = new PrismaBlogPostRepository();
  const result = await new CreateBlogPostUseCase(repo).execute(parsed.data);
  revalidateTag("blog", {});
  return NextResponse.json(result, { status: 201 });
}
