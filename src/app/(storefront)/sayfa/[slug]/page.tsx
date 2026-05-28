import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PrismaPageRepository } from "@/server/infrastructure/database/repositories/prisma-page.repository";
import { GetPageBySlugUseCase } from "@/server/application/admin/pages/page.use-cases";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const repo = new PrismaPageRepository();
  const page = await new GetPageBySlugUseCase(repo).execute(slug);
  if (!page) return { title: "Sayfa Bulunamadı" };
  return { title: page.title };
}

export default async function StaticPage({ params }: Props) {
  const { slug } = await params;
  const repo = new PrismaPageRepository();
  const page = await new GetPageBySlugUseCase(repo).execute(slug);
  if (!page) notFound();

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 md:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-brand-text mb-8">
        {page.title}
      </h1>
      <div
        className="prose prose-sm max-w-none text-brand-text leading-7
          prose-headings:font-bold prose-headings:text-brand-text
          prose-p:text-brand-muted prose-a:text-brand-primary-dark prose-a:no-underline hover:prose-a:underline"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
    </main>
  );
}
