import { ProductCard } from "@/modules/product/components/product-card";
import type { ProductCardItem } from "@/modules/product/types/product-card.types";

type CategoryProductGridProps = {
  products: ProductCardItem[];
};

export function CategoryProductGrid({
  products,
}: CategoryProductGridProps) {
  if (products.length === 0) {
    return (
      <section className="mt-8 rounded-[var(--radius-brand-lg)] border border-dashed border-brand-border bg-brand-white p-8 text-center">
        <h2 className="font-display text-xl font-bold text-brand-text">
          Bu kategoride henüz ürün bulunmuyor.
        </h2>

        <p className="mt-3 text-sm leading-6 text-brand-muted">
          Ürünler eklendiğinde burada listelenecek.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}