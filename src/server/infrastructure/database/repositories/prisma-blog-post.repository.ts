import { prisma } from "@/server/infrastructure/database/prisma/prisma-client";
import type { BlogPostRepository } from "@/server/domain/repositories/blog-post.repository";
import type { BlogPostListItem, BlogPostDetail, BlogPostInput } from "@/server/domain/entities/blog-post.entity";

export class PrismaBlogPostRepository implements BlogPostRepository {
  async listBlogPosts(): Promise<BlogPostListItem[]> {
    return prisma.blogPost.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      select: {
        id: true, title: true, slug: true, excerpt: true,
        coverImageUrl: true, coverImageAlt: true,
        isPublished: true, publishedAt: true, sortOrder: true,
      },
    });
  }

  async listPublishedBlogPosts(): Promise<BlogPostListItem[]> {
    return prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      select: {
        id: true, title: true, slug: true, excerpt: true,
        coverImageUrl: true, coverImageAlt: true,
        isPublished: true, publishedAt: true, sortOrder: true,
      },
    });
  }

  async findBlogPostById(id: string): Promise<BlogPostDetail | null> {
    return prisma.blogPost.findUnique({ where: { id } });
  }

  async findBlogPostBySlug(slug: string): Promise<BlogPostDetail | null> {
    return prisma.blogPost.findUnique({ where: { slug, isPublished: true } });
  }

  async createBlogPost(input: BlogPostInput): Promise<{ id: string }> {
    const post = await prisma.blogPost.create({ data: input });
    return { id: post.id };
  }

  async updateBlogPost(id: string, input: BlogPostInput): Promise<void> {
    await prisma.blogPost.update({ where: { id }, data: input });
  }

  async deleteBlogPost(id: string): Promise<void> {
    await prisma.blogPost.delete({ where: { id } });
  }
}
