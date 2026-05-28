import Link from "next/link";
import { notFound } from "next/navigation";
import { PrismaBlogPostRepository } from "@/server/infrastructure/database/repositories/prisma-blog-post.repository";
import { GetBlogPostUseCase } from "@/server/application/admin/blog/blog-post.use-cases";
import BlogPostForm from "@/modules/admin/components/blog/blog-post-form";

type Props = { params: Promise<{ id: string }> };

export default async function EditBlogPostPage({ params }: Props) {
  const { id } = await params;
  const repo = new PrismaBlogPostRepository();
  const post = await new GetBlogPostUseCase(repo).execute(id);
  if (!post) notFound();

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link href="/admin/blog" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition-colors mb-3">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Blog
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Yazıyı Düzenle</h1>
        <p className="mt-0.5 text-sm text-gray-500">{post.title}</p>
      </div>
      <BlogPostForm post={post} />
    </div>
  );
}
