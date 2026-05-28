import Link from "next/link";
import { PrismaBlogPostRepository } from "@/server/infrastructure/database/repositories/prisma-blog-post.repository";
import { ListBlogPostsUseCase } from "@/server/application/admin/blog/blog-post.use-cases";
import BlogPostDeleteButton from "@/modules/admin/components/blog/blog-post-delete-button";

function formatDate(date: Date | null): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("tr-TR", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function AdminBlogPage() {
  const repo = new PrismaBlogPostRepository();
  const posts = await new ListBlogPostsUseCase(repo).execute();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Blog</h1>
          <p className="text-sm text-gray-500 mt-0.5">Blog yazılarını oluşturun ve düzenleyin.</p>
        </div>
        <Link href="/admin/blog/yeni"
          className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
          + Yeni Yazı
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {posts.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">Henüz yazı eklenmemiş.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left">
                <th className="px-4 py-3 font-medium text-gray-500">Başlık</th>
                <th className="px-4 py-3 font-medium text-gray-500">URL</th>
                <th className="px-4 py-3 font-medium text-gray-500">Yayın Tarihi</th>
                <th className="px-4 py-3 font-medium text-gray-500">Durum</th>
                <th className="px-4 py-3 font-medium text-gray-500 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{p.title}</td>
                  <td className="px-4 py-3 text-gray-400 font-mono text-xs">/blog/{p.slug}</td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(p.publishedAt)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      p.isPublished ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}>
                      {p.isPublished ? "Yayında" : "Taslak"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/admin/blog/${p.id}/duzenle`}
                        className="text-indigo-600 hover:text-indigo-800 text-xs font-medium">
                        Düzenle
                      </Link>
                      <BlogPostDeleteButton id={p.id} title={p.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
