import Link from "next/link";
import { notFound } from "next/navigation";
import { PrismaCategoryAdminRepository } from "@/server/infrastructure/database/repositories/prisma-category-admin.repository";
import { GetCategoryAdminUseCase } from "@/server/application/admin/categories/category-admin.use-cases";
import CategoryForm from "@/modules/admin/components/categories/category-form";

type Props = { params: Promise<{ id: string }> };

export default async function EditCategoryPage({ params }: Props) {
  const { id } = await params;
  const repo = new PrismaCategoryAdminRepository();
  const category = await new GetCategoryAdminUseCase(repo).execute(id);
  if (!category) notFound();

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link href="/admin/kategoriler" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition-colors mb-3">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Kategoriler
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Kategoriyi Düzenle</h1>
        <p className="mt-0.5 text-sm text-gray-500">{category.name}</p>
      </div>
      <CategoryForm category={category} />
    </div>
  );
}
