import Link from "next/link";
import { notFound } from "next/navigation";
import { PrismaSliderAdminRepository } from "@/server/infrastructure/database/repositories/prisma-slider-admin.repository";
import { GetSliderAdminUseCase } from "@/server/application/admin/sliders/slider-admin.use-cases";
import SlideForm from "@/modules/admin/components/sliders/slide-form";

type Props = { params: Promise<{ id: string; slideId: string }> };

export default async function EditSlidePage({ params }: Props) {
  const { id, slideId } = await params;
  const repo = new PrismaSliderAdminRepository();
  const slider = await new GetSliderAdminUseCase(repo).execute(id);
  if (!slider) notFound();

  const slide = slider.slides.find((s) => s.id === slideId);
  if (!slide) notFound();

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link href={`/admin/sliderlar/${id}/duzenle`} className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition-colors mb-3">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          {slider.name}
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Slaytı Düzenle</h1>
        <p className="mt-0.5 text-sm text-gray-500">{slide.title}</p>
      </div>
      <SlideForm sliderId={id} slide={slide} />
    </div>
  );
}
