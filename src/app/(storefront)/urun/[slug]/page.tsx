import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductAttributeList } from "@/modules/product/components/product-attribute-list";
import { ProductBreadcrumb } from "@/modules/product/components/product-breadcrumb";
import { ProductDescription } from "@/modules/product/components/product-description";
import { ProductGallery } from "@/modules/product/components/product-gallery";
import { ProductPurchasePanel } from "@/modules/product/components/product-purchase-panel";
import { GetProductDetailUseCase } from "@/server/application/catalog/get-product-detail.use-case";
import { PrismaProductDetailRepository } from "@/server/infrastructure/database/repositories/prisma-product-detail.repository";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

async function getProductDetail(slug: string) {
  const productDetailRepository =
    new PrismaProductDetailRepository();

  const getProductDetailUseCase =
    new GetProductDetailUseCase(productDetailRepository);

  return getProductDetailUseCase.execute(slug);
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductDetail(slug);

  if (!product) {
    return {
      title: "Ürün Bulunamadı",
    };
  }

  return {
    title: product.name,
    description:
      product.shortDescription ??
      product.description ??
      `${product.name} ürün detaylarını inceleyin.`,
  };
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductDetail(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 md:py-10 lg:px-8">
      <ProductBreadcrumb
        categoryName={product.category.name}
        categorySlug={product.category.slug}
        productName={product.name}
      />

      <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr] lg:gap-8">
        <ProductGallery
          images={product.images}
          productName={product.name}
        />

        <ProductPurchasePanel
          productName={product.name}
          basePrice={product.basePrice}
          compareAtPrice={product.compareAtPrice}
          variants={product.variants}
          isFeatured={product.isFeatured}
        />
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <ProductDescription
          shortDescription={product.shortDescription}
          description={product.description}
        />

        <ProductAttributeList attributes={product.attributes} />
      </section>
    </main>
  );
}