import Link from "next/link";
import { notFound } from "next/navigation";
import { PrismaPageRepository } from "@/server/infrastructure/database/repositories/prisma-page.repository";
import { GetPageBySlugAdminUseCase } from "@/server/application/admin/pages/page.use-cases";
import { getCorporatePageDef } from "@/server/domain/entities/corporate-pages";
import PageForm from "@/modules/admin/components/pages/page-form";

type Props = { params: Promise<{ slug: string }> };

export default async function EditCorporatePage({ params }: Props) {
  const { slug } = await params;
  const def = getCorporatePageDef(slug);
  if (!def) notFound();

  const repo = new PrismaPageRepository();
  const page = await new GetPageBySlugAdminUseCase(repo).execute(slug);

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link href="/admin/sayfalar" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition-colors mb-3">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Kurumsal Sayfalar
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">{def.title}</h1>
        <p className="mt-0.5 text-sm text-gray-500 font-mono">/sayfa/{def.slug}</p>
      </div>
      <PageForm slug={def.slug} defaultTitle={def.title} page={page ?? undefined} />
    </div>
  );
}
