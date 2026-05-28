"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { PageDetail } from "@/server/domain/entities/page.entity";

type Props = {
  slug: string;
  defaultTitle: string;
  page?: PageDetail;
};

function inputClass() {
  return "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors";
}

export default function PageForm({ slug, defaultTitle, page }: Props) {
  const router = useRouter();

  const [title, setTitle] = useState(page?.title ?? defaultTitle);
  const [content, setContent] = useState(page?.content ?? "");
  const [isActive, setIsActive] = useState(page?.isActive ?? true);
  const [sortOrder, setSortOrder] = useState(page?.sortOrder?.toString() ?? "0");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const body = { title, slug, content, isActive, sortOrder: parseInt(sortOrder) };

    const res = await fetch("/api/admin/pages", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json();
      setError(typeof data.error === "string" ? data.error : "Bir hata oluştu.");
      return;
    }

    router.push("/admin/sayfalar");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-3xl">
      <section className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Sayfa Bilgileri</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Başlık *</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} required
                className={inputClass()} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Slug <span className="text-gray-300 font-normal">(sabit)</span>
              </label>
              <input value={slug} readOnly disabled
                className={`${inputClass()} font-mono text-gray-400 bg-gray-50 cursor-not-allowed`} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Sıralama</label>
              <input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}
                className={inputClass()} />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2.5 text-sm text-gray-600 cursor-pointer select-none">
                <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-200" />
                Aktif
              </label>
            </div>
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
            rows={16}
            placeholder="<p>Sayfa içeriğini buraya yazın...</p>"
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
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
        <button type="button" onClick={() => router.back()}
          className="border border-gray-200 text-gray-600 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
          İptal
        </button>
      </div>
    </form>
  );
}
