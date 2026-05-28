"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SliderAdminDetail } from "@/server/domain/entities/slider-admin.entity";

type Props = {
  slider?: Pick<SliderAdminDetail, "id" | "name" | "placement" | "isActive" | "sortOrder">;
};

export default function SliderForm({ slider }: Props) {
  const router = useRouter();
  const isEdit = !!slider;

  const [name, setName] = useState(slider?.name ?? "");
  const [placement, setPlacement] = useState(slider?.placement ?? "HOME_HERO");
  const [isActive, setIsActive] = useState(slider?.isActive ?? true);
  const [sortOrder, setSortOrder] = useState(slider?.sortOrder ?? 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const body = { name, placement, isActive, sortOrder };
    const url = isEdit ? `/api/admin/sliders/${slider.id}` : "/api/admin/sliders";
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

    if (!isEdit) {
      const data = await res.json();
      router.push(`/admin/sliderlar/${data.id}/duzenle`);
    } else {
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Slider Adı</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={2}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Yerleşim</label>
        <select
          value={placement}
          onChange={(e) => setPlacement(e.target.value as "HOME_HERO")}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="HOME_HERO">Ana Sayfa Hero</option>
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
          onClick={() => router.push("/admin/sliderlar")}
          className="bg-white border border-gray-300 text-gray-700 text-sm font-medium px-5 py-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          İptal
        </button>
      </div>
    </form>
  );
}
