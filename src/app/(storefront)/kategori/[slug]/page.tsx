import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryBreadcrumb } from "@/modules/category/components/category-breadcrumb";
import { CategoryHeader } from "@/modules/category/components/category-header";
import { CategoryProductGrid } from "@/modules/category/components/category-product-grid";
import { GetCategoryCatalogUseCase } from "@/server/application/catalog/get-category-catalog.use-case";
import { PrismaCategoryCatalogRepository } from "@/server/infrastructure/database/repositories/prisma-category-catalog.repository";

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

async function getCategoryCatalog(slug: string) {
  const categoryCatalogRepository =
    new PrismaCategoryCatalogRepository();

  const getCategoryCatalogUseCase =
    new GetCategoryCatalogUseCase(categoryCatalogRepository);

  return getCategoryCatalogUseCase.execute(slug);
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryCatalog(slug);

  if (!category) {
    return {
      title: "Kategori Bulunamadı",
    };
  }

  return {
    title: category.name,
    description:
      category.description ??
      `${category.name} kategorisindeki ürünleri inceleyin.`,
  };
}

export default async function CategoryPage({
  params,
}: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryCatalog(slug);

  if (!category) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 md:py-10 lg:px-8">
      <CategoryBreadcrumb categoryName={category.name} />

      <CategoryHeader
        name={category.name}
        description={category.description}
        productCount={category.products.length}
      />

      <CategoryProductGrid products={category.products} />
    </main>
  );
}