import Link from "next/link";
import { PrismaHomeSectionAdminRepository } from "@/server/infrastructure/database/repositories/prisma-home-section-admin.repository";
import { ListHomeSectionsUseCase } from "@/server/application/admin/home-sections/home-section-admin.use-cases";
import HomeSectionDeleteButton from "@/modules/admin/components/home-sections/home-section-delete-button";

const TYPE_LABELS = {
  HERO_SLIDER: "Hero Slider",
  CATEGORY_SHOWCASE: "Kategori Vitrini",
  PROMO_BANNER: "Tanıtım Banner",
  PRODUCT_SHOWCASE: "Ürün Vitrini",
};

export default async function AdminHomeSectionsPage() {
  const repo = new PrismaHomeSectionAdminRepository();
  const sections = await new ListHomeSectionsUseCase(repo).execute();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Anasayfa Blokları</h1>
        <Link
          href="/admin/ana-sayfa-bloklari/yeni"
          className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          + Yeni Blok
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {sections.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">Henüz blok eklenmemiş.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left">
                <th className="px-4 py-3 font-medium text-gray-500">Başlık</th>
                <th className="px-4 py-3 font-medium text-gray-500">Tip</th>
                <th className="px-4 py-3 font-medium text-gray-500 text-right">Öğe</th>
                <th className="px-4 py-3 font-medium text-gray-500">Sıra</th>
                <th className="px-4 py-3 font-medium text-gray-500">Durum</th>
                <th className="px-4 py-3 font-medium text-gray-500 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {sections.map((s) => (
                <tr key={s.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{s.title ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{TYPE_LABELS[s.type] ?? s.type}</td>
                  <td className="px-4 py-3 text-right text-gray-600">{s.itemCount}</td>
                  <td className="px-4 py-3 text-gray-600">{s.sortOrder}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      s.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}>
                      {s.isActive ? "Aktif" : "Pasif"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/ana-sayfa-bloklari/${s.id}/duzenle`}
                        className="text-indigo-600 hover:text-indigo-800 text-xs font-medium"
                      >
                        Düzenle
                      </Link>
                      <HomeSectionDeleteButton id={s.id} title={s.title ?? s.type} />
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
