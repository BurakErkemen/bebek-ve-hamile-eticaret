import Link from "next/link";
import { notFound } from "next/navigation";
import { PrismaProductAdminRepository } from "@/server/infrastructure/database/repositories/prisma-product-admin.repository";
import { GetProductAdminUseCase } from "@/server/application/admin/products/get-product-admin.use-case";
import ProductForm from "@/modules/admin/components/products/product-form";

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const repo = new PrismaProductAdminRepository();
  const product = await new GetProductAdminUseCase(repo).execute(id);

  if (!product) notFound();

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link href="/admin/urunler" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition-colors mb-3">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Ürünler
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Ürünü Düzenle</h1>
        <p className="mt-0.5 text-sm text-gray-500">{product.name}</p>
      </div>
      <ProductForm product={product} />
    </div>
  );
}
