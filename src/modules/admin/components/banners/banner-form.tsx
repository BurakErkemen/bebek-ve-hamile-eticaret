"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { BannerAdminDetail, BannerPlacement, VisualTone } from "@/server/domain/entities/banner-admin.entity";

type Props = { banner?: BannerAdminDetail };

const PLACEMENT_LABELS: Record<BannerPlacement, string> = {
  HOME_PROMO: "Ana Sayfa Tanıtım",
  CATEGORY_PROMO: "Kategori Tanıtım",
  GLOBAL_PROMO: "Genel Tanıtım",
};

const TONE_LABELS: Record<VisualTone, string> = {
  ROSE: "Rose (Pembe)",
  SAGE: "Sage (Yeşil)",
  PEACH: "Peach (Şeftali)",
};

export default function BannerForm({ banner }: Props) {
  const router = useRouter();
  const isEdit = !!banner;

  const [name, setName] = useState(banner?.name ?? "");
  const [placement, setPlacement] = useState<BannerPlacement>(banner?.placement ?? "HOME_PROMO");
  const [eyebrow, setEyebrow] = useState(banner?.eyebrow ?? "");
  const [title, setTitle] = useState(banner?.title ?? "");
  const [description, setDescription] = useState(banner?.description ?? "");
  const [actionLabel, setActionLabel] = useState(banner?.actionLabel ?? "");
  const [actionHref, setActionHref] = useState(banner?.actionHref ?? "");
  const [imageUrl, setImageUrl] = useState(banner?.imageUrl ?? "");
  const [imageAlt, setImageAlt] = useState(banner?.imageAlt ?? "");
  const [tone, setTone] = useState<VisualTone>(banner?.tone ?? "ROSE");
  const [isActive, setIsActive] = useState(banner?.isActive ?? true);
  const [sortOrder, setSortOrder] = useState(banner?.sortOrder?.toString() ?? "0");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (res.ok) {
      const data = await res.json();
      setImageUrl(data.url);
    }
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const body = {
      name,
      placement,
      eyebrow: eyebrow || undefined,
      title,
      description: description || undefined,
      actionLabel: actionLabel || undefined,
      actionHref: actionHref || undefined,
      imageUrl: imageUrl || undefined,
      imageAlt: imageAlt || undefined,
      tone,
      isActive,
      sortOrder: parseInt(sortOrder),
    };

    const url = isEdit ? `/api/admin/banners/${banner!.id}` : "/api/admin/banners";
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

    router.push("/admin/bannerlar");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
      <section className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Banner Bilgileri</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Banner Adı *</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Yerleşim *</label>
              <select value={placement} onChange={(e) => setPlacement(e.target.value as BannerPlacement)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors">
                {(Object.keys(PLACEMENT_LABELS) as BannerPlacement[]).map((p) => (
                  <option key={p} value={p}>{PLACEMENT_LABELS[p]}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Üst Başlık (Eyebrow)</label>
              <input value={eyebrow} onChange={(e) => setEyebrow(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Başlık *</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Açıklama</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors resize-none" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Buton Metni</label>
              <input value={actionLabel} onChange={(e) => setActionLabel(e.target.value)}
                placeholder="Örn: Alışverişe Başla"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Buton URL</label>
              <input value={actionHref} onChange={(e) => setActionHref(e.target.value)}
                placeholder="Örn: /kategoriler/bebek"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Görsel</h2>
        </div>
        <div className="p-6 space-y-4">
          {imageUrl && (
            <img src={imageUrl} alt="Önizleme" className="w-48 h-28 object-cover rounded-lg border border-gray-100" />
          )}
          <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading}
            className="block text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
          {uploading && <p className="text-xs text-gray-500">Yükleniyor...</p>}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Görsel Alt Metni</label>
            <input value={imageAlt} onChange={(e) => setImageAlt(e.target.value)}
              placeholder="Görsel açıklaması"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors" />
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Görünüm & Ayarlar</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Renk Tonu</label>
              <select value={tone} onChange={(e) => setTone(e.target.value as VisualTone)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors">
                {(Object.keys(TONE_LABELS) as VisualTone[]).map((t) => (
                  <option key={t} value={t}>{TONE_LABELS[t]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Sıralama</label>
              <input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors" />
            </div>
          </div>
          <div className="mt-4">
            <label className="flex items-center gap-2.5 text-sm text-gray-600 cursor-pointer select-none">
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-200" />
              Aktif
            </label>
          </div>
        </div>
      </section>

      {error && (
        <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
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
          {saving ? "Kaydediliyor..." : isEdit ? "Güncelle" : "Banner Ekle"}
        </button>
        <button type="button" onClick={() => router.back()}
          className="border border-gray-200 text-gray-600 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
          İptal
        </button>
      </div>
    </form>
  );
}
