"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  HomeSectionAdminDetail,
  HomeSectionType,
} from "@/server/domain/entities/home-section-admin.entity";
import HomeSectionItemsPanel from "./home-section-items-panel";

type SliderOption = { id: string; name: string };
type BannerOption = { id: string; name: string; title: string };

const TYPE_LABELS: Record<HomeSectionType, string> = {
  HERO_SLIDER: "Hero Slider",
  CATEGORY_SHOWCASE: "Kategori Vitrini",
  PROMO_BANNER: "Tanıtım Banner",
  PRODUCT_SHOWCASE: "Ürün Vitrini",
};

type Props = { section?: HomeSectionAdminDetail };

export default function HomeSectionForm({ section }: Props) {
  const router = useRouter();
  const isEdit = !!section;

  const [type, setType] = useState<HomeSectionType>(section?.type ?? "CATEGORY_SHOWCASE");
  const [eyebrow, setEyebrow] = useState(section?.eyebrow ?? "");
  const [title, setTitle] = useState(section?.title ?? "");
  const [description, setDescription] = useState(section?.description ?? "");
  const [actionLabel, setActionLabel] = useState(section?.actionLabel ?? "");
  const [actionHref, setActionHref] = useState(section?.actionHref ?? "");
  const [sliderId, setSliderId] = useState(section?.sliderId ?? "");
  const [bannerId, setBannerId] = useState(section?.bannerId ?? "");
  const [isActive, setIsActive] = useState(section?.isActive ?? true);
  const [sortOrder, setSortOrder] = useState(section?.sortOrder?.toString() ?? "0");

  const [sliders, setSliders] = useState<SliderOption[]>([]);
  const [banners, setBanners] = useState<BannerOption[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/sliders").then((r) => r.json()).then(setSliders);
    fetch("/api/admin/banners").then((r) => r.json()).then(setBanners);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const body = {
      type,
      eyebrow: eyebrow || undefined,
      title: title || undefined,
      description: description || undefined,
      actionLabel: actionLabel || undefined,
      actionHref: actionHref || undefined,
      sliderId: sliderId || undefined,
      bannerId: bannerId || undefined,
      isActive,
      sortOrder: parseInt(sortOrder),
    };

    const url = isEdit ? `/api/admin/home-sections/${section!.id}` : "/api/admin/home-sections";
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

    router.push("/admin/ana-sayfa-bloklari");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
      <section className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Blok Bilgileri</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Blok Tipi *</label>
            <select value={type} onChange={(e) => setType(e.target.value as HomeSectionType)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors">
              {(Object.keys(TYPE_LABELS) as HomeSectionType[]).map((t) => (
                <option key={t} value={t}>{TYPE_LABELS[t]}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Üst Başlık (Eyebrow)</label>
              <input value={eyebrow} onChange={(e) => setEyebrow(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Başlık</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Açıklama</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors resize-none" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Buton Metni</label>
              <input value={actionLabel} onChange={(e) => setActionLabel(e.target.value)}
                placeholder="Örn: Tümünü Gör"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Buton URL</label>
              <input value={actionHref} onChange={(e) => setActionHref(e.target.value)}
                placeholder="Örn: /kategoriler"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors" />
            </div>
          </div>
        </div>
      </section>

      {(type === "HERO_SLIDER") && (
        <section className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-700">Slider Bağlantısı</h2>
          </div>
          <div className="p-6">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Slider</label>
            <select value={sliderId} onChange={(e) => setSliderId(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors">
              <option value="">— Seçiniz —</option>
              {sliders.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </section>
      )}

      {(type === "PROMO_BANNER") && (
        <section className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-700">Banner Bağlantısı</h2>
          </div>
          <div className="p-6">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Banner</label>
            <select value={bannerId} onChange={(e) => setBannerId(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors">
              <option value="">— Seçiniz —</option>
              {banners.map((b) => (
                <option key={b.id} value={b.id}>{b.name} — {b.title}</option>
              ))}
            </select>
          </div>
        </section>
      )}

      <section className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Ayarlar</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Sıralama</label>
              <input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors" />
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

      {isEdit && (type === "CATEGORY_SHOWCASE" || type === "PRODUCT_SHOWCASE") && (
        <HomeSectionItemsPanel
          sectionId={section!.id}
          initialItems={section!.items}
          sectionType={type}
        />
      )}

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
          {saving ? "Kaydediliyor..." : isEdit ? "Güncelle" : "Blok Ekle"}
        </button>
        <button type="button" onClick={() => router.back()}
          className="border border-gray-200 text-gray-600 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
          İptal
        </button>
      </div>
    </form>
  );
}
