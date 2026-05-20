import { CartPageContent } from "@/modules/cart/components/cart-page-content";

export const metadata = {
  title: "Sepetim",
};

export default function CartPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 md:py-10 lg:px-8">
      <div className="mb-8">
        <p className="font-display text-sm font-bold uppercase tracking-[0.18em] text-brand-primary-dark">
          Alışveriş
        </p>

        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-brand-text md:text-4xl">
          Sepetim
        </h1>
      </div>

      <CartPageContent />
    </main>
  );
}