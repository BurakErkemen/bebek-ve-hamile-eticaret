"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SliderSlideAdminItem, VisualTone } from "@/server/domain/entities/slider-admin.entity";

type Props = {
  sliderId: string;
  slide?: SliderSlideAdminItem;
};

export default function SlideForm({ sliderId, slide }: Props) {
  const router = useRouter();
  const isEdit = !!slide;

  const [title, setTitle] = useState(slide?.title ?? "");
  const [eyebrow, setEyebrow] = useState(slide?.eyebrow ?? "");
  const [description, setDescription] = useState(slide?.description ?? "");
  const [primaryActionLabel, setPrimaryActionLabel] = useState(slide?.primaryActionLabel ?? "");
  const [primaryActionHref, setPrimaryActionHref] = useState(slide?.primaryActionHref ?? "");
  const [secondaryActionLabel, setSecondaryActionLabel] = useState(slide?.secondaryActionLabel ?? "");
  const [secondaryActionHref, setSecondaryActionHref] = useState(slide?.secondaryActionHref ?? "");
  const [imageUrl, setImageUrl] = useState(slide?.imageUrl ?? "");
  const [imageAlt, setImageAlt] = useState(slide?.imageAlt ?? "");
  const [tone, setTone] = useState<VisualTone>(slide?.tone ?? "ROSE");
  const [isActive, setIsActive] = useState(slide?.isActive ?? true);
  const [sortOrder, setSortOrder] = useState(slide?.sortOrder ?? 0);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    setLoading(true);
    setError("");

    const body = {
      title,
      eyebrow: eyebrow || undefined,
      description: description || undefined,
      primaryActionLabel: primaryActionLabel || undefined,
      primaryActionHref: primaryActionHref || undefined,
      secondaryActionLabel: secondaryActionLabel || undefined,
      secondaryActionHref: secondaryActionHref || undefined,
      imageUrl: imageUrl || undefined,
      imageAlt: imageAlt || undefined,
      tone,
      isActive,
      sortOrder,
    };

    const url = isEdit
      ? `/api/admin/sliders/${sliderId}/slides/${slide.id}`
      : `/api/admin/sliders/${sliderId}/slides`;
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      setError("Kaydedilemedi. Lütfen tekrar deneyin.");
      setLoading(false);
      return;
    }

    router.push(`/admin/sliderlar/${sliderId}/duzenle`);
    router.refresh();
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Başlık *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Üst Başlık (Eyebrow)</label>
        <input
          type="text"
          value={eyebrow}
          onChange={(e) => setEyebrow(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Birincil Buton Metni</label>
          <input
            type="text"
            value={primaryActionLabel}
            onChange={(e) => setPrimaryActionLabel(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Birincil Buton URL</label>
          <input
            type="text"
            value={primaryActionHref}
            onChange={(e) => setPrimaryActionHref(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">İkincil Buton Metni</label>
          <input
            type="text"
            value={secondaryActionLabel}
            onChange={(e) => setSecondaryActionLabel(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">İkincil Buton URL</label>
          <input
            type="text"
            value={secondaryActionHref}
            onChange={(e) => setSecondaryActionHref(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Görsel</label>
        {imageUrl && (
          <img src={imageUrl} alt="Önizleme" className="w-32 h-20 object-cover rounded-lg mb-2" />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploading}
          className="block text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />
        {uploading && <p className="text-xs text-gray-500 mt-1">Yükleniyor...</p>}
        <input
          type="text"
          value={imageAlt}
          onChange={(e) => setImageAlt(e.target.value)}
          placeholder="Görsel açıklaması (alt)"
          className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Renk Tonu</label>
        <select
          value={tone}
          onChange={(e) => setTone(e.target.value as VisualTone)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="ROSE">Rose (Pembe)</option>
          <option value="SAGE">Sage (Yeşil)</option>
          <option value="PEACH">Peach (Şeftali)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Sıra</label>
        <input
          type="number"
          value={sortOrder}
          onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isActive"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="rounded border-gray-300"
        />
        <label htmlFor="isActive" className="text-sm text-gray-700">Aktif</label>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "Kaydediliyor..." : isEdit ? "Kaydet" : "Oluştur"}
        </button>
        <button
          type="button"
          onClick={() => router.push(`/admin/sliderlar/${sliderId}/duzenle`)}
          className="bg-white border border-gray-300 text-gray-700 text-sm font-medium px-5 py-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          İptal
        </button>
      </div>
    </form>
  );
}
