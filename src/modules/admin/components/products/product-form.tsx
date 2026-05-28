"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { ProductAdminDetail } from "@/server/domain/entities/product-admin.entity";

type Category = { id: string; name: string; parentId: string | null };

type VariantRow = {
  _key: string;
  sku: string;
  size: string;
  colorName: string;
  colorHex: string;
  price: string;
  compareAtPrice: string;
  stockQuantity: string;
  isActive: boolean;
  sortOrder: number;
};

type ImageRow = {
  _key: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  sortOrder: number;
};

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

function uid() {
  return Math.random().toString(36).slice(2);
}

const emptyVariant = (): VariantRow => ({
  _key: uid(), sku: "", size: "", colorName: "", colorHex: "",
  price: "", compareAtPrice: "", stockQuantity: "0", isActive: true, sortOrder: 0,
});

type Props = { product?: ProductAdminDetail };

export default function ProductForm({ product }: Props) {
  const router = useRouter();
  const isEdit = !!product;

  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugManual, setSlugManual] = useState(isEdit);
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? "");
  const [shortDescription, setShortDescription] = useState(product?.shortDescription ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [basePrice, setBasePrice] = useState(product?.basePrice?.toString() ?? "");
  const [compareAtPrice, setCompareAtPrice] = useState(product?.compareAtPrice?.toString() ?? "");
  const [isActive, setIsActive] = useState(product?.isActive ?? true);
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured ?? false);
  const [sortOrder, setSortOrder] = useState(product?.sortOrder?.toString() ?? "0");

  const [images, setImages] = useState<ImageRow[]>(
    product?.images.map((img) => ({ ...img, _key: uid(), alt: img.alt ?? "" })) ?? []
  );
  const [variants, setVariants] = useState<VariantRow[]>(
    product?.variants.map((v) => ({
      _key: uid(),
      sku: v.sku,
      size: v.size ?? "",
      colorName: v.colorName ?? "",
      colorHex: v.colorHex ?? "",
      price: v.price?.toString() ?? "",
      compareAtPrice: v.compareAtPrice?.toString() ?? "",
      stockQuantity: v.stockQuantity.toString(),
      isActive: v.isActive,
      sortOrder: v.sortOrder,
    })) ?? [emptyVariant()]
  );

  const [categories, setCategories] = useState<Category[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then(setCategories);
  }, []);

  function handleNameChange(val: string) {
    setName(val);
    if (!slugManual) setSlug(toSlug(val));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);
    if (data.url) {
      setImages((prev) => [
        ...prev,
        { _key: uid(), url: data.url, alt: "", isPrimary: prev.length === 0, sortOrder: prev.length },
      ]);
    }
    e.target.value = "";
  }

  function setPrimary(key: string) {
    setImages((prev) => prev.map((img) => ({ ...img, isPrimary: img._key === key })));
  }

  function removeImage(key: string) {
    setImages((prev) => {
      const next = prev.filter((img) => img._key !== key);
      if (next.length > 0 && !next.some((img) => img.isPrimary)) next[0].isPrimary = true;
      return next;
    });
  }

  function updateVariant(key: string, field: keyof VariantRow, value: string | boolean) {
    setVariants((prev) => prev.map((v) => v._key === key ? { ...v, [field]: value } : v));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const body = {
      name, slug, categoryId,
      shortDescription: shortDescription || undefined,
      description: description || undefined,
      basePrice: parseFloat(basePrice),
      compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : undefined,
      isActive, isFeatured,
      sortOrder: parseInt(sortOrder),
      images: images.map(({ url, alt, isPrimary, sortOrder }) => ({ url, alt: alt || undefined, isPrimary, sortOrder })),
      variants: variants.map(({ sku, size, colorName, colorHex, price, compareAtPrice, stockQuantity, isActive, sortOrder }) => ({
        sku, size: size || undefined, colorName: colorName || undefined,
        colorHex: colorHex || undefined,
        price: price ? parseFloat(price) : undefined,
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : undefined,
        stockQuantity: parseInt(stockQuantity), isActive, sortOrder,
      })),
    };

    const url = isEdit ? `/api/admin/products/${product!.id}` : "/api/admin/products";
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

    router.push("/admin/urunler");
    router.refresh();
  }

  const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors";
  const sectionHeaderCls = "px-6 py-4 border-b border-gray-100";
  const sectionBodyCls = "p-6 space-y-4";
  const labelCls = "block text-xs font-medium text-gray-500 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-4xl">

      {/* Temel Bilgiler */}
      <section className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className={sectionHeaderCls}>
          <h2 className="text-sm font-semibold text-gray-700">Temel Bilgiler</h2>
        </div>
        <div className={sectionBodyCls}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Ürün Adı *</label>
              <input value={name} onChange={(e) => handleNameChange(e.target.value)} className={inputCls} required />
            </div>
            <div>
              <label className={labelCls}>Slug *</label>
              <input value={slug}
                onChange={(e) => { setSlug(e.target.value); setSlugManual(true); }}
                className={inputCls + " font-mono text-gray-600"}
                required />
            </div>
          </div>

          <div>
            <label className={labelCls}>Kategori *</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={inputCls} required>
              <option value="">Seçiniz</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>Kısa Açıklama</label>
            <textarea value={shortDescription} onChange={(e) => setShortDescription(e.target.value)}
              rows={2} className={inputCls + " resize-none"} />
          </div>

          <div>
            <label className={labelCls}>Açıklama</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}
              rows={4} className={inputCls + " resize-none"} />
          </div>
        </div>
      </section>

      {/* Fiyat & Durum */}
      <section className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className={sectionHeaderCls}>
          <h2 className="text-sm font-semibold text-gray-700">Fiyat & Durum</h2>
        </div>
        <div className={sectionBodyCls}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className={labelCls}>Fiyat (₺) *</label>
              <input type="number" step="0.01" min="0" value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)} className={inputCls} required />
            </div>
            <div>
              <label className={labelCls}>Eski Fiyat (₺)</label>
              <input type="number" step="0.01" min="0" value={compareAtPrice}
                onChange={(e) => setCompareAtPrice(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Sıralama</label>
              <input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className={inputCls} />
            </div>
            <div className="flex flex-col gap-3 pt-6">
              <label className="flex items-center gap-2.5 text-sm text-gray-600 cursor-pointer select-none">
                <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-200" />
                Aktif
              </label>
              <label className="flex items-center gap-2.5 text-sm text-gray-600 cursor-pointer select-none">
                <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-200" />
                Öne Çıkan
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* Görseller */}
      <section className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className={sectionHeaderCls}>
          <h2 className="text-sm font-semibold text-gray-700">Görseller</h2>
        </div>
        <div className={sectionBodyCls}>
          <div className="flex flex-wrap gap-3">
            {images.map((img) => (
              <div key={img._key} className="relative group w-24 h-24">
                <Image src={img.url} alt={img.alt || "Ürün görseli"} fill className="object-cover rounded-xl border border-gray-100" />
                {img.isPrimary && (
                  <span className="absolute top-1.5 left-1.5 bg-indigo-600 text-white text-[10px] font-medium px-1.5 py-0.5 rounded-md">Ana</span>
                )}
                <div className="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                  {!img.isPrimary && (
                    <button type="button" onClick={() => setPrimary(img._key)}
                      className="bg-white text-gray-700 text-[10px] font-medium px-1.5 py-0.5 rounded-md hover:bg-indigo-50">
                      Ana Yap
                    </button>
                  )}
                  <button type="button" onClick={() => removeImage(img._key)}
                    className="bg-white text-red-600 text-[10px] font-medium px-1.5 py-0.5 rounded-md hover:bg-red-50">
                    Sil
                  </button>
                </div>
              </div>
            ))}

            <label className={`w-24 h-24 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors ${uploading ? "border-gray-100 text-gray-300" : "border-gray-200 text-gray-400 hover:border-indigo-300 hover:text-indigo-500"}`}>
              {uploading ? (
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <>
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  <span className="text-[10px] mt-1">Görsel Ekle</span>
                </>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
            </label>
          </div>
        </div>
      </section>

      {/* Varyantlar */}
      <section className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className={sectionHeaderCls + " flex items-center justify-between"}>
          <h2 className="text-sm font-semibold text-gray-700">Varyantlar</h2>
          <button type="button" onClick={() => setVariants((p) => [...p, emptyVariant()])}
            className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Varyant Ekle
          </button>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  {["SKU *", "Beden", "Renk Adı", "Renk Kodu", "Fiyat (₺)", "Stok *", "Aktif", ""].map((h) => (
                    <th key={h} className="pb-2.5 pr-3 font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {variants.map((v) => (
                  <tr key={v._key}>
                    {(["sku", "size", "colorName"] as const).map((field) => (
                      <td key={field} className="py-2 pr-2">
                        <input value={v[field]} onChange={(e) => updateVariant(v._key, field, e.target.value)}
                          className="w-full border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-200 focus:border-indigo-400 text-gray-800"
                          required={field === "sku"} />
                      </td>
                    ))}
                    <td className="py-2 pr-2">
                      <input value={v.colorHex} onChange={(e) => updateVariant(v._key, "colorHex", e.target.value)}
                        placeholder="#ffffff"
                        className="w-24 border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-200 focus:border-indigo-400 font-mono text-gray-600" />
                    </td>
                    <td className="py-2 pr-2">
                      <input type="number" step="0.01" min="0" value={v.price}
                        onChange={(e) => updateVariant(v._key, "price", e.target.value)}
                        className="w-20 border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-200 focus:border-indigo-400 text-gray-800" />
                    </td>
                    <td className="py-2 pr-2">
                      <input type="number" min="0" value={v.stockQuantity}
                        onChange={(e) => updateVariant(v._key, "stockQuantity", e.target.value)}
                        className="w-16 border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-200 focus:border-indigo-400 text-gray-800"
                        required />
                    </td>
                    <td className="py-2 pr-2">
                      <input type="checkbox" checked={v.isActive}
                        onChange={(e) => updateVariant(v._key, "isActive", e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-200" />
                    </td>
                    <td className="py-2">
                      {variants.length > 1 && (
                        <button type="button" onClick={() => setVariants((p) => p.filter((x) => x._key !== v._key))}
                          className="text-gray-300 hover:text-red-500 transition-colors">
                          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 18 18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {error && (
        <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="text-red-500 mt-0.5 flex-shrink-0">
            <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
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
          {saving ? "Kaydediliyor..." : isEdit ? "Güncelle" : "Ürün Ekle"}
        </button>
        <button type="button" onClick={() => router.back()}
          className="border border-gray-200 text-gray-600 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
          İptal
        </button>
      </div>
    </form>
  );
}
