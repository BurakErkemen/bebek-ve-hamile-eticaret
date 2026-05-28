import type { BlogPostRepository } from "@/server/domain/repositories/blog-post.repository";
import type { BlogPostInput } from "@/server/domain/entities/blog-post.entity";

export class ListBlogPostsUseCase {
  constructor(private readonly repo: BlogPostRepository) {}
  execute() { return this.repo.listBlogPosts(); }
}

export class ListPublishedBlogPostsUseCase {
  constructor(private readonly repo: BlogPostRepository) {}
  execute() { return this.repo.listPublishedBlogPosts(); }
}

export class GetBlogPostUseCase {
  constructor(private readonly repo: BlogPostRepository) {}
  execute(id: string) { return this.repo.findBlogPostById(id); }
}

export class GetBlogPostBySlugUseCase {
  constructor(private readonly repo: BlogPostRepository) {}
  execute(slug: string) { return this.repo.findBlogPostBySlug(slug); }
}

export class CreateBlogPostUseCase {
  constructor(private readonly repo: BlogPostRepository) {}
  execute(input: BlogPostInput) { return this.repo.createBlogPost(input); }
}

export class UpdateBlogPostUseCase {
  constructor(private readonly repo: BlogPostRepository) {}
  execute(id: string, input: BlogPostInput) { return this.repo.updateBlogPost(id, input); }
}

export class DeleteBlogPostUseCase {
  constructor(private readonly repo: BlogPostRepository) {}
  execute(id: string) { return this.repo.deleteBlogPost(id); }
}
