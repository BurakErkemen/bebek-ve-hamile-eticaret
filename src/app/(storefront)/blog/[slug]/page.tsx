import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PrismaBlogPostRepository } from "@/server/infrastructure/database/repositories/prisma-blog-post.repository";
import { GetBlogPostBySlugUseCase } from "@/server/application/admin/blog/blog-post.use-cases";

type Props = { params: Promise<{ slug: string }> };

function formatDate(date: Date | null): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const repo = new PrismaBlogPostRepository();
  const post = await new GetBlogPostBySlugUseCase(repo).execute(slug);
  if (!post) return { title: "Yazı Bulunamadı" };
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const repo = new PrismaBlogPostRepository();
  const post = await new GetBlogPostBySlugUseCase(repo).execute(slug);
  if (!post) notFound();

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 md:px-6 lg:px-8">
      <Link href="/blog" className="inline-flex items-center gap-1 text-sm font-medium text-brand-muted transition hover:text-brand-primary-dark">
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Tüm Yazılar
      </Link>

      <header className="mt-6">
        {post.publishedAt && (
          <span className="text-sm font-medium text-brand-muted">{formatDate(post.publishedAt)}</span>
        )}
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-brand-text md:text-4xl">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="mt-4 text-base leading-7 text-brand-muted">{post.excerpt}</p>
        )}
      </header>

      {post.coverImageUrl && (
        <div className="mt-8 overflow-hidden rounded-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.coverImageUrl} alt={post.coverImageAlt ?? post.title} className="w-full object-cover" />
        </div>
      )}

      <div
        className="prose prose-sm mt-8 max-w-none text-brand-text leading-7
          prose-headings:font-bold prose-headings:text-brand-text
          prose-p:text-brand-muted prose-a:text-brand-primary-dark prose-a:no-underline hover:prose-a:underline"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </main>
  );
}
