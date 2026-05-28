import type { BlogPostListItem, BlogPostDetail, BlogPostInput } from "@/server/domain/entities/blog-post.entity";

export interface BlogPostRepository {
  listBlogPosts(): Promise<BlogPostListItem[]>;
  listPublishedBlogPosts(): Promise<BlogPostListItem[]>;
  findBlogPostById(id: string): Promise<BlogPostDetail | null>;
  findBlogPostBySlug(slug: string): Promise<BlogPostDetail | null>;
  createBlogPost(input: BlogPostInput): Promise<{ id: string }>;
  updateBlogPost(id: string, input: BlogPostInput): Promise<void>;
  deleteBlogPost(id: string): Promise<void>;
}
