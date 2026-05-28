import Link from "next/link";
import { GetOrderSummaryUseCase } from "@/server/application/checkout/get-order-summary.use-case";
import { PrismaOrderLookupRepository } from "@/server/infrastructure/database/repositories/prisma-order-lookup.repository";

export const metadata = {
  title: "Ödeme Başarısız",
};

type PageProps = {
  searchParams: Promise<{ merchant_oid?: string }>;
};

export default async function PaymentFailurePage({ searchParams }: PageProps) {
  const { merchant_oid: merchantOid } = await searchParams;

  const order = merchantOid
    ? await new GetOrderSummaryUseCase(
        new PrismaOrderLookupRepository(),
      ).execute(merchantOid)
    : null;

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-12 md:px-6 md:py-16 lg:px-8">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </div>

        <h1 className="mt-5 font-display text-2xl font-bold text-brand-text md:text-3xl">
          Ödeme tamamlanamadı
        </h1>

        <p className="mt-3 max-w-md text-brand-text/70">
          {order?.paymentFailureMessage
            ? order.paymentFailureMessage
            : "Ödeme işlemi sırasında bir sorun oluştu ve ödemeniz alınamadı. Kartınızdan herhangi bir çekim yapılmadıysa tekrar deneyebilirsiniz."}
        </p>

        {order && (
          <p className="mt-2 text-sm text-brand-text/50">
            Sipariş No: {order.orderNumber}
          </p>
        )}
      </div>

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/sepet"
          className="inline-flex items-center justify-center rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold text-brand-white transition hover:bg-brand-primary-dark"
        >
          Sepete dön ve tekrar dene
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full border border-brand-border bg-brand-white px-6 py-3 text-sm font-semibold text-brand-text transition hover:bg-brand-secondary"
        >
          Ana sayfaya dön
        </Link>
      </div>
    </main>
  );
}
