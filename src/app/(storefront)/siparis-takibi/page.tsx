import { OrderTrackingForm } from "@/modules/checkout/components/order-tracking-form";

export const metadata = {
  title: "Sipariş Takibi",
  description:
    "Sipariş numaranız ve e-posta adresinizle siparişinizin durumunu sorgulayın.",
};

export default function OrderTrackingPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10 md:px-6 md:py-12 lg:px-8">
      <div className="mb-8">
        <p className="font-display text-sm font-bold uppercase tracking-[0.18em] text-brand-primary-dark">
          Sipariş Takibi
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-brand-text md:text-4xl">
          Siparişini sorgula
        </h1>
        <p className="mt-3 text-brand-text/70">
          Sipariş onay e-postandaki sipariş numarası ve e-posta adresinle
          siparişinin güncel durumunu görüntüleyebilirsin.
        </p>
      </div>

      <OrderTrackingForm />
    </main>
  );
}
