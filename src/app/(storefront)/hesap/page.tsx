import { redirect } from "next/navigation";
import { getCurrentCustomer } from "@/server/application/auth/get-current-customer";
import { GetCustomerOrdersUseCase } from "@/server/application/auth/get-customer-orders.use-case";
import { PrismaOrderLookupRepository } from "@/server/infrastructure/database/repositories/prisma-order-lookup.repository";
import type { OrderSummaryStatus } from "@/server/domain/entities/order-summary.entity";
import { OrderSummaryCard } from "@/modules/checkout/components/order-summary-card";
import { LogoutButton } from "@/modules/auth/components/logout-button";

export const metadata = {
  title: "Hesabım",
};

const STATUS_LABELS: Record<OrderSummaryStatus, string> = {
  DRAFT: "Taslak",
  PENDING_PAYMENT: "Ödeme bekleniyor",
  PROCESSING: "Hazırlanıyor",
  SHIPPED: "Kargoya verildi",
  DELIVERED: "Teslim edildi",
  CANCELLED: "İptal edildi",
};

function statusToneClass(status: OrderSummaryStatus): string {
  switch (status) {
    case "DELIVERED":
    case "SHIPPED":
    case "PROCESSING":
      return "bg-green-100 text-green-700";
    case "CANCELLED":
      return "bg-red-100 text-red-700";
    default:
      return "bg-amber-100 text-amber-700";
  }
}

const dateFormatter = new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export default async function AccountPage() {
  const customer = await getCurrentCustomer();
  if (!customer) {
    redirect("/giris?next=/hesap");
  }

  const orders = await new GetCustomerOrdersUseCase(
    new PrismaOrderLookupRepository(),
  ).execute(customer.id, customer.email);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 md:px-6 md:py-12 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-brand-text">
            Merhaba, {customer.firstName}
          </h1>
          <p className="mt-1 text-sm text-brand-muted">{customer.email}</p>
        </div>
        <LogoutButton />
      </div>

      <section className="mt-10">
        <h2 className="font-display text-xl font-bold text-brand-text">
          Siparişlerim
        </h2>

        {orders.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-brand-border bg-brand-white p-10 text-center text-sm text-brand-muted">
            Henüz bir siparişin bulunmuyor.
          </p>
        ) : (
          <div className="mt-4 space-y-6">
            {orders.map((order) => (
              <div key={order.orderNumber} className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusToneClass(order.status)}`}
                  >
                    {STATUS_LABELS[order.status]}
                  </span>
                  <span className="text-xs text-brand-muted">
                    {dateFormatter.format(order.createdAt)}
                  </span>
                </div>
                <OrderSummaryCard order={order} />
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
