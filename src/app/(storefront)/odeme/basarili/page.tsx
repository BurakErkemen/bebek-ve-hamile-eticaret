import Link from "next/link";
import { GetOrderSummaryUseCase } from "@/server/application/checkout/get-order-summary.use-case";
import { PrismaOrderLookupRepository } from "@/server/infrastructure/database/repositories/prisma-order-lookup.repository";
import { OrderSummaryCard } from "@/modules/checkout/components/order-summary-card";

export const metadata = {
  title: "Ödeme Başarılı",
};

type PageProps = {
  searchParams: Promise<{ merchant_oid?: string }>;
};

export default async function PaymentSuccessPage({ searchParams }: PageProps) {
  const { merchant_oid: merchantOid } = await searchParams;

  const order = merchantOid
    ? await new GetOrderSummaryUseCase(
        new PrismaOrderLookupRepository(),
      ).execute(merchantOid)
    : null;

  const isConfirmed = order?.paymentStatus === "SUCCESS";

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-12 md:px-6 md:py-16 lg:px-8">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>

        <h1 className="mt-5 font-display text-2xl font-bold text-brand-text md:text-3xl">
          {isConfirmed
            ? "Ödemeniz alındı, teşekkürler!"
            : "Siparişiniz oluşturuldu"}
        </h1>

        <p className="mt-3 max-w-md text-brand-text/70">
          {isConfirmed
            ? "Siparişiniz hazırlanmaya başlanacak. Sipariş detaylarını e-posta adresinize gönderdik."
            : "Ödemeniz işleniyor. Onaylandığında sipariş detaylarını e-posta adresinize göndereceğiz."}
        </p>
      </div>

      {order && (
        <div className="mt-8">
          <OrderSummaryCard order={order} />
        </div>
      )}

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold text-brand-white transition hover:bg-brand-primary-dark"
        >
          Alışverişe devam et
        </Link>
        <Link
          href="/siparis-takibi"
          className="inline-flex items-center justify-center rounded-full border border-brand-border bg-brand-white px-6 py-3 text-sm font-semibold text-brand-text transition hover:bg-brand-secondary"
        >
          Sipariş takibi
        </Link>
      </div>
    </main>
  );
}
