import Link from "next/link";
import { PrismaSliderAdminRepository } from "@/server/infrastructure/database/repositories/prisma-slider-admin.repository";
import { ListSlidersUseCase } from "@/server/application/admin/sliders/slider-admin.use-cases";
import SliderDeleteButton from "@/modules/admin/components/sliders/slider-delete-button";

const PLACEMENT_LABELS = { HOME_HERO: "Ana Sayfa Hero" };

export default async function AdminSlidersPage() {
  const repo = new PrismaSliderAdminRepository();
  const sliders = await new ListSlidersUseCase(repo).execute();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Sliderlar</h1>
        <Link
          href="/admin/sliderlar/yeni"
          className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          + Yeni Slider
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {sliders.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">Henüz slider eklenmemiş.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left">
                <th className="px-4 py-3 font-medium text-gray-500">Slider Adı</th>
                <th className="px-4 py-3 font-medium text-gray-500">Yerleşim</th>
                <th className="px-4 py-3 font-medium text-gray-500 text-right">Slayt</th>
                <th className="px-4 py-3 font-medium text-gray-500">Durum</th>
                <th className="px-4 py-3 font-medium text-gray-500 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {sliders.map((s) => (
                <tr key={s.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{s.name}</td>
                  <td className="px-4 py-3 text-gray-600">{PLACEMENT_LABELS[s.placement]}</td>
                  <td className="px-4 py-3 text-right text-gray-600">{s.slideCount}</td>
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
                        href={`/admin/sliderlar/${s.id}/duzenle`}
                        className="text-indigo-600 hover:text-indigo-800 text-xs font-medium"
                      >
                        Düzenle
                      </Link>
                      <SliderDeleteButton id={s.id} name={s.name} />
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
