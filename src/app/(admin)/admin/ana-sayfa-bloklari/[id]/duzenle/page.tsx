import Link from "next/link";
import { notFound } from "next/navigation";
import { PrismaHomeSectionAdminRepository } from "@/server/infrastructure/database/repositories/prisma-home-section-admin.repository";
import { GetHomeSectionAdminUseCase } from "@/server/application/admin/home-sections/home-section-admin.use-cases";
import HomeSectionForm from "@/modules/admin/components/home-sections/home-section-form";

type Props = { params: Promise<{ id: string }> };

export default async function EditHomeSectionPage({ params }: Props) {
  const { id } = await params;
  const repo = new PrismaHomeSectionAdminRepository();
  const section = await new GetHomeSectionAdminUseCase(repo).execute(id);
  if (!section) notFound();

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link href="/admin/ana-sayfa-bloklari" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition-colors mb-3">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Anasayfa Blokları
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Bloğu Düzenle</h1>
        <p className="mt-0.5 text-sm text-gray-500">{section.title ?? section.type}</p>
      </div>
      <HomeSectionForm section={section} />
    </div>
  );
}
