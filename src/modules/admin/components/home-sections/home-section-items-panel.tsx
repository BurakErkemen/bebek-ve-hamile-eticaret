"use client";

import { useState, useEffect } from "react";
import type { HomeSectionItemAdmin, HomeSectionType, VisualTone } from "@/server/domain/entities/home-section-admin.entity";

type CategoryOption = { id: string; name: string; slug: string };
type ProductOption = { id: string; name: string; slug: string };

const TONE_LABELS: Record<VisualTone, string> = {
  ROSE: "Pembe",
  SAGE: "Yeşil",
  PEACH: "Şeftali",
};

type Props = {
  sectionId: string;
  initialItems: HomeSectionItemAdmin[];
  sectionType: HomeSectionType;
};

type AddFormState = {
  categoryId: string;
  productId: string;
  title: string;
  description: string;
  href: string;
  badge: string;
  tone: VisualTone;
  isActive: boolean;
  sortOrder: string;
};

const defaultForm = (): AddFormState => ({
  categoryId: "",
  productId: "",
  title: "",
  description: "",
  href: "",
  badge: "",
  tone: "ROSE",
  isActive: true,
  sortOrder: "0",
});

export default function HomeSectionItemsPanel({ sectionId, initialItems, sectionType }: Props) {
  const [items, setItems] = useState<HomeSectionItemAdmin[]>(initialItems);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<AddFormState>(defaultForm());
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sectionType === "CATEGORY_SHOWCASE") {
      fetch("/api/admin/categories")
        .then((r) => r.json())
        .then(setCategories);
    } else if (sectionType === "PRODUCT_SHOWCASE") {
      fetch("/api/admin/products")
        .then((r) => r.json())
        .then((data: { items?: ProductOption[]; products?: ProductOption[] } | ProductOption[]) => {
          if (Array.isArray(data)) setProducts(data);
          else if (data.items) setProducts(data.items);
        });
    }
  }, [sectionType]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const itemType = sectionType === "CATEGORY_SHOWCASE" ? "CATEGORY_CARD" : "PRODUCT_REFERENCE";

    const body = {
      itemType,
      categoryId: form.categoryId || undefined,
      productId: form.productId || undefined,
      title: form.title || undefined,
      description: form.description || undefined,
      href: form.href || undefined,
      badge: form.badge || undefined,
      tone: form.tone,
      isActive: form.isActive,
      sortOrder: parseInt(form.sortOrder) || 0,
    };

    const res = await fetch(`/api/admin/home-sections/${sectionId}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setSaving(false);

    if (!res.ok) {
      setError("Öğe eklenemedi.");
      return;
    }

    const { id } = await res.json() as { id: string };
    const categoryName = isCategory
      ? categories.find((c) => c.id === form.categoryId)?.name ?? null
      : null;
    const productName = isProduct
      ? products.find((p) => p.id === form.productId)?.name ?? null
      : null;

    const newItem: HomeSectionItemAdmin = {
      id,
      itemType,
      categoryId: form.categoryId || null,
      categoryName,
      productId: form.productId || null,
      productName,
      title: form.title || null,
      description: form.description || null,
      href: form.href || null,
      badge: form.badge || null,
      tone: form.tone,
      isActive: form.isActive,
      sortOrder: parseInt(form.sortOrder) || 0,
    };
    setItems((prev) => [...prev, newItem]);
    setForm(defaultForm());
    setShowAdd(false);
  }

  async function handleDelete(itemId: string) {
    setDeletingId(itemId);
    const res = await fetch(`/api/admin/home-sections/${sectionId}/items/${itemId}`, {
      method: "DELETE",
    });
    setDeletingId(null);
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== itemId));
    }
  }

  function field(key: keyof AddFormState, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const isCategory = sectionType === "CATEGORY_SHOWCASE";
  const isProduct = sectionType === "PRODUCT_SHOWCASE";

  return (
    <section className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-700">İçerik Öğeleri</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {isCategory ? "Bu vitrine eklenecek kategoriler" : "Bu vitrine eklenecek ürünler"}
          </p>
        </div>
        {!showAdd && (
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-1.5 text-xs font-medium bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
          >
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Öğe Ekle
          </button>
        )}
      </div>

      {/* Current items */}
      {items.length > 0 ? (
        <ul className="divide-y divide-gray-50">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-3 px-6 py-3">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.isActive ? "bg-green-400" : "bg-gray-300"}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {item.categoryName ?? item.productName ?? item.title ?? "—"}
                </p>
                <p className="text-xs text-gray-400">
                  {item.itemType === "CATEGORY_CARD" ? "Kategori" : item.itemType === "PRODUCT_REFERENCE" ? "Ürün" : "Özel Link"}
                  {" · "}
                  {TONE_LABELS[item.tone]}
                  {item.badge ? ` · ${item.badge}` : ""}
                  {" · Sıra: "}{item.sortOrder}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                disabled={deletingId === item.id}
                className="flex-shrink-0 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                title="Sil"
              >
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        !showAdd && (
          <div className="px-6 py-8 text-center">
            <p className="text-sm text-gray-400">Henüz öğe eklenmedi.</p>
          </div>
        )
      )}

      {/* Add form */}
      {showAdd && (
        <form onSubmit={handleAdd} className="p-6 space-y-4 border-t border-gray-50">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Yeni Öğe</h3>

          {isCategory && (
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Kategori *</label>
              <select
                required
                value={form.categoryId}
                onChange={(e) => field("categoryId", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
              >
                <option value="">— Seçiniz —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          {isProduct && (
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Ürün *</label>
              <select
                required
                value={form.productId}
                onChange={(e) => field("productId", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
              >
                <option value="">— Seçiniz —</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Başlık (opsiyonel)</label>
              <input
                value={form.title}
                onChange={(e) => field("title", e.target.value)}
                placeholder="Kategori/ürün adını geçersiz kılar"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Etiket</label>
              <input
                value={form.badge}
                onChange={(e) => field("badge", e.target.value)}
                placeholder="Örn: Yeni, %20 İndirim"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Açıklama</label>
            <input
              value={form.description}
              onChange={(e) => field("description", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Renk Tonu</label>
              <select
                value={form.tone}
                onChange={(e) => field("tone", e.target.value as VisualTone)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
              >
                {(Object.keys(TONE_LABELS) as VisualTone[]).map((t) => (
                  <option key={t} value={t}>{TONE_LABELS[t]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Sıralama</label>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => field("sortOrder", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
              />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-200"
                />
                Aktif
              </label>
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex items-center gap-2 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {saving ? "Ekleniyor..." : "Ekle"}
            </button>
            <button
              type="button"
              onClick={() => { setShowAdd(false); setForm(defaultForm()); setError(null); }}
              className="border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              İptal
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
