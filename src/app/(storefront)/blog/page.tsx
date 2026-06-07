import type { Metadata } from "next";
import Link from "next/link";
import { getCachedPublishedBlogPosts } from "@/server/application/blog/get-blog-posts.cached";

export const metadata: Metadata = {
  title: "Blog",
  description: "Bebek, anne ve hamilelik üzerine güncel yazılar ve öneriler.",
};

// Build sırasında DB'ye bağlanmayı deneme — istek anında render et.
export const dynamic = "force-dynamic";

function formatDate(date: Date | null): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" });
}

export default async function BlogListPage() {
  const posts = await getCachedPublishedBlogPosts();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6 lg:px-8">
      <header className="mb-10 text-center">
        <h1 className="font-display text-3xl font-bold tracking-tight text-brand-text md:text-4xl">Blog</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-brand-muted">
          Bebek bakımı, hamilelik ve anne-bebek konularında öneriler ve güncel içerikler.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="py-16 text-center text-sm text-brand-muted">Henüz yayımlanmış bir yazı bulunmuyor.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-brand-border bg-brand-white transition hover:shadow-lg">
              <div className="aspect-[16/10] overflow-hidden bg-brand-surface">
                {post.coverImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={post.coverImageUrl} alt={post.coverImageAlt ?? post.title}
                    className="h-full w-full object-cover transition group-hover:scale-105" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-brand-muted">
                    <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                {post.publishedAt && (
                  <span className="text-xs font-medium text-brand-muted">{formatDate(post.publishedAt)}</span>
                )}
                <h2 className="mt-1.5 font-display text-lg font-bold leading-snug text-brand-text transition group-hover:text-brand-primary-dark">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-brand-muted">{post.excerpt}</p>
                )}
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-primary-dark">
                  Devamını oku
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="transition group-hover:translate-x-0.5">
                    <path d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
