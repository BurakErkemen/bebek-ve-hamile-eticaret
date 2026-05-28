import Link from "next/link";
import { PrismaBannerAdminRepository } from "@/server/infrastructure/database/repositories/prisma-banner-admin.repository";
import { ListBannersUseCase } from "@/server/application/admin/banners/banner-admin.use-cases";
import BannerDeleteButton from "@/modules/admin/components/banners/banner-delete-button";

const PLACEMENT_LABELS = {
  HOME_PROMO: "Ana Sayfa",
  CATEGORY_PROMO: "Kategori",
  GLOBAL_PROMO: "Genel",
};

const TONE_LABELS = {
  ROSE: "Pembe",
  SAGE: "Yeşil",
  PEACH: "Şeftali",
};

export default async function AdminBannersPage() {
  const repo = new PrismaBannerAdminRepository();
  const banners = await new ListBannersUseCase(repo).execute();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Bannerlar</h1>
        <Link
          href="/admin/bannerlar/yeni"
          className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          + Yeni Banner
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {banners.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">Henüz banner eklenmemiş.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left">
                <th className="px-4 py-3 font-medium text-gray-500">Başlık</th>
                <th className="px-4 py-3 font-medium text-gray-500">Yerleşim</th>
                <th className="px-4 py-3 font-medium text-gray-500">Sıra</th>
                <th className="px-4 py-3 font-medium text-gray-500">Durum</th>
                <th className="px-4 py-3 font-medium text-gray-500 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {banners.map((b) => (
                <tr key={b.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-800">{b.title}</div>
                    <div className="text-xs text-gray-400">{b.name}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{PLACEMENT_LABELS[b.placement] ?? b.placement}</td>
                  <td className="px-4 py-3 text-gray-600">{b.sortOrder}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      b.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}>
                      {b.isActive ? "Aktif" : "Pasif"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/bannerlar/${b.id}/duzenle`}
                        className="text-indigo-600 hover:text-indigo-800 text-xs font-medium"
                      >
                        Düzenle
                      </Link>
                      <BannerDeleteButton id={b.id} name={b.name} />
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
