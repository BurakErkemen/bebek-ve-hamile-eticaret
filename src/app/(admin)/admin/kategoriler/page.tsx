import Link from "next/link";
import { PrismaCategoryAdminRepository } from "@/server/infrastructure/database/repositories/prisma-category-admin.repository";
import { ListCategoriesUseCase } from "@/server/application/admin/categories/category-admin.use-cases";
import CategoryDeleteButton from "@/modules/admin/components/categories/category-delete-button";

export default async function AdminCategoriesPage() {
  const repo = new PrismaCategoryAdminRepository();
  const categories = await new ListCategoriesUseCase(repo).execute();

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Kategoriler</h1>
          <p className="mt-0.5 text-sm text-gray-500">{categories.length} kategori listeleniyor</p>
        </div>
        <Link
          href="/admin/kategoriler/yeni"
          className="inline-flex items-center gap-1.5 bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Yeni Kategori
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-3">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                <path d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-700">Henüz kategori eklenmemiş</p>
            <p className="text-xs text-gray-400 mt-1">İlk kategorinizi oluşturun.</p>
            <Link href="/admin/kategoriler/yeni" className="mt-4 text-sm text-indigo-600 font-medium hover:text-indigo-800">
              + Yeni Kategori Ekle
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Kategori</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Üst Kategori</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Ürün</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Durum</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-4 py-3.5">
                    <p className="font-medium text-gray-900">{c.name}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{c.slug}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    {c.parentName ? (
                      <span className="text-gray-600 text-sm">{c.parentName}</span>
                    ) : (
                      <span className="text-gray-300 text-sm">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-right text-gray-500 tabular-nums">{c.productCount}</td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                      c.isActive
                        ? "bg-green-50 text-green-700 ring-1 ring-green-100"
                        : "bg-gray-100 text-gray-500"
                    }`}>
                      {c.isActive ? "Aktif" : "Pasif"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/kategoriler/${c.id}/duzenle`}
                        className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium"
                      >
                        Düzenle
                      </Link>
                      <CategoryDeleteButton id={c.id} name={c.name} />
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
