import { ProductCard } from "@/modules/product/components/product-card";
import type { ProductCardItem } from "@/modules/product/types/product-card.types";

type CategoryProductGridProps = {
  products: ProductCardItem[];
  hasSidebar?: boolean;
};

export function CategoryProductGrid({ products, hasSidebar = false }: CategoryProductGridProps) {
  if (products.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-brand-border bg-brand-white p-10 text-center">
        <p className="font-semibold text-brand-text">Bu kategoride henüz ürün bulunmuyor.</p>
        <p className="mt-1 text-sm text-brand-muted">Ürünler eklendiğinde burada listelenecek.</p>
      </section>
    );
  }

  const gridCols = hasSidebar
    ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-3"
    : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";

  return (
    <section>
      <div className={`grid gap-4 ${gridCols}`}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
