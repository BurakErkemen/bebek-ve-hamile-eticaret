import Link from "next/link";
import { notFound } from "next/navigation";
import { PrismaSliderAdminRepository } from "@/server/infrastructure/database/repositories/prisma-slider-admin.repository";
import { GetSliderAdminUseCase } from "@/server/application/admin/sliders/slider-admin.use-cases";
import SliderForm from "@/modules/admin/components/sliders/slider-form";
import SlideDeleteButton from "@/modules/admin/components/sliders/slide-delete-button";

type Props = { params: Promise<{ id: string }> };

const TONE_LABELS = { ROSE: "Pembe", SAGE: "Yeşil", PEACH: "Şeftali" };

export default async function EditSliderPage({ params }: Props) {
  const { id } = await params;
  const repo = new PrismaSliderAdminRepository();
  const slider = await new GetSliderAdminUseCase(repo).execute(id);
  if (!slider) notFound();

  return (
    <div className="p-8 space-y-8">
      <div>
        <Link href="/admin/sliderlar" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition-colors mb-3">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Sliderlar
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Slideri Düzenle</h1>
        <p className="mt-0.5 text-sm text-gray-500">{slider.name}</p>
      </div>

      <SliderForm slider={slider} />

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-800">Slaytlar ({slider.slides.length})</h2>
          <Link
            href={`/admin/sliderlar/${id}/slayt/yeni`}
            className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            + Yeni Slayt
          </Link>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {slider.slides.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">Henüz slayt eklenmemiş.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left">
                  <th className="px-4 py-3 font-medium text-gray-500">Başlık</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Ton</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Sıra</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Durum</th>
                  <th className="px-4 py-3 font-medium text-gray-500 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {slider.slides.map((slide) => (
                  <tr key={slide.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-800">{slide.title}</div>
                      {slide.eyebrow && <div className="text-xs text-gray-400">{slide.eyebrow}</div>}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{TONE_LABELS[slide.tone] ?? slide.tone}</td>
                    <td className="px-4 py-3 text-gray-600">{slide.sortOrder}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        slide.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}>
                        {slide.isActive ? "Aktif" : "Pasif"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/sliderlar/${id}/slayt/${slide.id}/duzenle`}
                          className="text-indigo-600 hover:text-indigo-800 text-xs font-medium"
                        >
                          Düzenle
                        </Link>
                        <SlideDeleteButton sliderId={id} slideId={slide.id} title={slide.title} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
