"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { BlogPostDetail } from "@/server/domain/entities/blog-post.entity";

type Props = { post?: BlogPostDetail };

function toSlug(str: string): string {
  const map: Record<string, string> = {
    ğ: "g", ü: "u", ş: "s", ı: "i", ö: "o", ç: "c",
    Ğ: "g", Ü: "u", Ş: "s", İ: "i", Ö: "o", Ç: "c",
  };
  return str
    .replace(/[ğüşıöçĞÜŞİÖÇ]/g, (c) => map[c] || c)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function inputClass() {
  return "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors";
}

export default function BlogPostForm({ post }: Props) {
  const router = useRouter();
  const isEdit = !!post;

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugManual, setSlugManual] = useState(isEdit);
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(post?.coverImageUrl ?? "");
  const [coverImageAlt, setCoverImageAlt] = useState(post?.coverImageAlt ?? "");
  const [isPublished, setIsPublished] = useState(post?.isPublished ?? false);
  const [publishedAt, setPublishedAt] = useState(
    post?.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 16) : ""
  );
  const [sortOrder, setSortOrder] = useState(post?.sortOrder?.toString() ?? "0");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!slugManual) setSlug(toSlug(val));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const body = {
      title,
      slug,
      excerpt: excerpt || null,
      content,
      coverImageUrl: coverImageUrl || null,
      coverImageAlt: coverImageAlt || null,
      isPublished,
      publishedAt: publishedAt ? new Date(publishedAt).toISOString() : null,
      sortOrder: parseInt(sortOrder),
    };

    const url = isEdit ? `/api/admin/blog/${post!.id}` : "/api/admin/blog";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json();
      setError(typeof data.error === "string" ? data.error : "Bir hata oluştu.");
      return;
    }

    router.push("/admin/blog");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-3xl">
      <section className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Yazı Bilgileri</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Başlık *</label>
              <input value={title} onChange={(e) => handleTitleChange(e.target.value)} required
                className={inputClass()} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Slug * <span className="text-gray-300 font-normal">(/blog/slug)</span>
              </label>
              <input value={slug} onChange={(e) => { setSlug(e.target.value); setSlugManual(true); }} required
                className={`${inputClass()} font-mono text-gray-600`} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Özet</label>
            <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3}
              placeholder="Blog listesinde görünecek kısa özet..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors resize-y" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Kapak Görseli URL</label>
              <input value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)}
                placeholder="/uploads/blog/gorsel.jpg"
                className={inputClass()} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Kapak Görseli Alt Metni</label>
              <input value={coverImageAlt} onChange={(e) => setCoverImageAlt(e.target.value)}
                className={inputClass()} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Yayın Tarihi</label>
              <input type="datetime-local" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)}
                className={inputClass()} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Sıralama</label>
              <input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}
                className={inputClass()} />
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <label className="flex items-center gap-2.5 text-sm text-gray-600 cursor-pointer select-none">
              <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-200" />
              Yayında
            </label>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">İçerik</h2>
          <p className="text-xs text-gray-400 mt-0.5">HTML desteklenir. Paragraf için &lt;p&gt;, başlık için &lt;h2&gt;, kalın için &lt;strong&gt;.</p>
        </div>
        <div className="p-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={20}
            placeholder="<p>Yazı içeriğini buraya yazın...</p>"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 font-mono placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors resize-y"
          />
        </div>
      </section>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="flex items-center gap-2.5">
        <button type="submit" disabled={saving}
          className="inline-flex items-center gap-1.5 bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors">
          {saving && (
            <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          {saving ? "Kaydediliyor..." : isEdit ? "Güncelle" : "Yazı Oluştur"}
        </button>
        <button type="button" onClick={() => router.back()}
          className="border border-gray-200 text-gray-600 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
          İptal
        </button>
      </div>
    </form>
  );
}
