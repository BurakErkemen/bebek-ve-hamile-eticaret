import { unstable_cache } from "next/cache";
import { prisma } from "@/server/infrastructure/database/prisma/prisma-client";
import type { BlogPostListItem } from "@/server/domain/entities/blog-post.entity";

export const getCachedPublishedBlogPosts = unstable_cache(
  async (): Promise<BlogPostListItem[]> => {
    return prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      select: {
        id: true, title: true, slug: true, excerpt: true,
        coverImageUrl: true, coverImageAlt: true,
        isPublished: true, publishedAt: true, sortOrder: true,
      },
    });
  },
  ["blog-posts"],
  { revalidate: 300, tags: ["blog"] },
);
