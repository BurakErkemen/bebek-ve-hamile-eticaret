import Link from "next/link";
import BlogPostForm from "@/modules/admin/components/blog/blog-post-form";

export default function NewBlogPostPage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <Link href="/admin/blog" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition-colors mb-3">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Blog
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Yeni Yazı</h1>
      </div>
      <BlogPostForm />
    </div>
  );
}
