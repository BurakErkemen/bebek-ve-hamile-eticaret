import Link from "next/link";
import { PrismaPageRepository } from "@/server/infrastructure/database/repositories/prisma-page.repository";
import { GetCorporatePageStatusesUseCase } from "@/server/application/admin/pages/page.use-cases";
import { CORPORATE_PAGES, CORPORATE_PAGE_SLUGS } from "@/server/domain/entities/corporate-pages";

export default async function AdminPagesPage() {
  const repo = new PrismaPageRepository();
  const statuses = await new GetCorporatePageStatusesUseCase(repo).execute(CORPORATE_PAGE_SLUGS);
  const statusMap = new Map(statuses.map((s) => [s.slug, s]));

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Kurumsal Sayfalar</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Hakkımızda, Gizlilik İlkeleri, Şartlar ve Koşullar gibi sabit kurumsal sayfaların içeriğini düzenleyin.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-left">
              <th className="px-4 py-3 font-medium text-gray-500">Sayfa</th>
              <th className="px-4 py-3 font-medium text-gray-500">URL</th>
              <th className="px-4 py-3 font-medium text-gray-500">İçerik</th>
              <th className="px-4 py-3 font-medium text-gray-500">Durum</th>
              <th className="px-4 py-3 font-medium text-gray-500 text-right">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {CORPORATE_PAGES.map((def) => {
              const status = statusMap.get(def.slug);
              const exists = !!status;
              const hasContent = status?.hasContent ?? false;
              const isActive = status?.isActive ?? false;

              return (
                <tr key={def.slug} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{def.title}</td>
                  <td className="px-4 py-3 text-gray-400 font-mono text-xs">/sayfa/{def.slug}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      hasContent ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                    }`}>
                      {hasContent ? "Dolu" : "Boş"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {exists ? (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}>
                        {isActive ? "Aktif" : "Pasif"}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-400">
                        Oluşturulmadı
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end">
                      <Link href={`/admin/sayfalar/${def.slug}`}
                        className="text-indigo-600 hover:text-indigo-800 text-xs font-medium">
                        {exists ? "Düzenle" : "İçerik Ekle"}
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
