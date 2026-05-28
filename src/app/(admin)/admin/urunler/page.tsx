import Link from "next/link";
import Image from "next/image";
import { PrismaProductAdminRepository } from "@/server/infrastructure/database/repositories/prisma-product-admin.repository";
import { ListProductsUseCase } from "@/server/application/admin/products/list-products.use-case";
import ProductDeleteButton from "@/modules/admin/components/products/product-delete-button";

export default async function AdminProductsPage() {
  const repo = new PrismaProductAdminRepository();
  const products = await new ListProductsUseCase(repo).execute();

  return (
    <div className="p-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Ürünler</h1>
          <p className="mt-0.5 text-sm text-gray-500">{products.length} ürün listeleniyor</p>
        </div>
        <Link
          href="/admin/urunler/yeni"
          className="inline-flex items-center gap-1.5 bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Yeni Ürün
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-3">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                <path d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                <path d="M6 6h.008v.008H6V6Z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-700">Henüz ürün eklenmemiş</p>
            <p className="text-xs text-gray-400 mt-1">İlk ürününüzü eklemek için başlayın.</p>
            <Link href="/admin/urunler/yeni" className="mt-4 text-sm text-indigo-600 font-medium hover:text-indigo-800">
              + Yeni Ürün Ekle
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-12"></th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Ürün</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Kategori</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Fiyat</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Stok</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Durum</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-4 py-3.5">
                    {p.primaryImageUrl ? (
                      <Image
                        src={p.primaryImageUrl}
                        alt={p.name}
                        width={40}
                        height={40}
                        className="rounded-lg object-cover w-10 h-10 ring-1 ring-gray-100"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="text-gray-300" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Z" />
                        </svg>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="font-medium text-gray-900">{p.name}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{p.slug}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-gray-600 text-sm">{p.category.name}</span>
                  </td>
                  <td className="px-4 py-3.5 text-right font-medium text-gray-900 tabular-nums">
                    {p.basePrice.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺
                  </td>
                  <td className="px-4 py-3.5 text-right text-gray-500 tabular-nums">{p.totalStock}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                        p.isActive
                          ? "bg-green-50 text-green-700 ring-1 ring-green-100"
                          : "bg-gray-100 text-gray-500"
                      }`}>
                        {p.isActive ? "Aktif" : "Pasif"}
                      </span>
                      {p.isFeatured && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-amber-50 text-amber-700 ring-1 ring-amber-100">
                          Öne Çıkan
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/urunler/${p.id}/duzenle`}
                        className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium"
                      >
                        Düzenle
                      </Link>
                      <ProductDeleteButton id={p.id} name={p.name} />
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
