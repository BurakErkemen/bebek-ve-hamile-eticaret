import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentCustomer } from "@/server/application/auth/get-current-customer";
import { GetCustomerOrdersUseCase } from "@/server/application/auth/get-customer-orders.use-case";
import { PrismaOrderLookupRepository } from "@/server/infrastructure/database/repositories/prisma-order-lookup.repository";
import { LogoutButton } from "@/modules/auth/components/logout-button";
import { ProfileForm } from "@/modules/auth/components/profile-form";
import { formatTRY } from "@/shared/utils/format-currency";
import type { OrderSummaryStatus } from "@/server/domain/entities/order-summary.entity";

export const metadata = { title: "Hesabım" };

const STATUS_LABEL: Record<OrderSummaryStatus, string> = {
  DRAFT:           "Taslak",
  PENDING_PAYMENT: "Ödeme bekleniyor",
  PROCESSING:      "Hazırlanıyor",
  SHIPPED:         "Kargoya verildi",
  DELIVERED:       "Teslim edildi",
  CANCELLED:       "İptal edildi",
};

const STATUS_COLOR: Record<OrderSummaryStatus, string> = {
  DRAFT:           "bg-surface-warm text-ink-3",
  PENDING_PAYMENT: "bg-amber-subtle text-amber",
  PROCESSING:      "bg-sky-subtle text-sky",
  SHIPPED:         "bg-sage-subtle text-sage",
  DELIVERED:       "bg-sage-subtle text-sage",
  CANCELLED:       "bg-red-50 text-red-600",
};

const dateFmt = new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit", month: "long", year: "numeric",
});

export default async function AccountPage() {
  const customer = await getCurrentCustomer();
  if (!customer) redirect("/giris?next=/hesap");

  const orders = await new GetCustomerOrdersUseCase(
    new PrismaOrderLookupRepository(),
  ).execute(customer.id, customer.email);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 md:px-6 md:py-14">
      {/* Başlık */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink-3">Hesabım</p>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-ink">
            Merhaba, {customer.firstName} 👋
          </h1>
          <p className="mt-0.5 text-sm text-ink-3">{customer.email}</p>
        </div>
        <LogoutButton />
      </div>

      {/* Profil Düzenleme */}
      <section className="mt-10">
        <h2 className="mb-5 font-display text-lg font-bold text-ink">Kişisel Bilgiler</h2>
        <div className="rounded-[var(--radius-lg)] border border-border bg-surface-card p-6 shadow-[var(--shadow-xs)]">
          <ProfileForm customer={customer} />
        </div>
      </section>

      {/* Sipariş Geçmişi */}
      <section className="mt-10">
        <h2 className="mb-5 font-display text-lg font-bold text-ink">Siparişlerim</h2>

        {orders.length === 0 ? (
          <div className="rounded-[var(--radius-lg)] border border-dashed border-border bg-surface-card p-10 text-center">
            <p className="text-sm text-ink-3">Henüz bir siparişin bulunmuyor.</p>
            <Link href="/" className="btn-amber mt-5 inline-flex text-sm">
              Alışverişe Başla
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div
                key={order.orderNumber}
                className="rounded-[var(--radius-lg)] border border-border bg-surface-card p-5 shadow-[var(--shadow-xs)]"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLOR[order.status]}`}>
                      {STATUS_LABEL[order.status]}
                    </span>
                    <span className="font-mono text-sm font-semibold text-ink">
                      #{order.orderNumber}
                    </span>
                  </div>
                  <span className="text-xs text-ink-3">{dateFmt.format(order.createdAt)}</span>
                </div>

                {order.items && order.items.length > 0 && (
                  <ul className="mt-4 divide-y divide-border">
                    {order.items.map((item, i) => (
                      <li key={i} className="flex items-center justify-between gap-4 py-3">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-ink">{item.productName}</p>
                          {item.variantLabel && (
                            <p className="text-xs text-ink-3">{item.variantLabel}</p>
                          )}
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-xs text-ink-3">×{item.quantity}</p>
                          <p className="text-sm font-semibold text-ink">
                            {formatTRY(Number(item.unitPrice) * item.quantity, { decimals: false })}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                  <span className="text-xs text-ink-3">Toplam</span>
                  <span className="font-semibold text-ink">
                    {formatTRY(Number(order.totalAmount), { decimals: false })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
