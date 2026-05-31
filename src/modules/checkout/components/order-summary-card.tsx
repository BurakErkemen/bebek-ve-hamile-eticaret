import Image from "next/image";
import type { OrderSummary } from "@/server/domain/entities/order-summary.entity";
import { formatTRY } from "@/shared/utils/format-currency";


export function OrderSummaryCard({ order }: { order: OrderSummary }) {
  return (
    <div className="rounded-[var(--radius-brand-xl)] border border-brand-border bg-brand-white p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-brand-border pb-4">
        <div>
          <p className="text-sm text-brand-text/60">Sipariş No</p>
          <p className="font-display text-lg font-bold text-brand-text">
            {order.orderNumber}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-brand-text/60">Toplam</p>
          <p className="font-display text-lg font-bold text-brand-text">
            {formatTRY(order.totalAmount, { decimals: false })}
          </p>
        </div>
      </div>

      <ul className="divide-y divide-brand-border">
        {order.items.map((item, index) => (
          <li key={index} className="flex items-center gap-3 py-3">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-brand-secondary">
              {item.imageUrl && (
                <Image
                  src={item.imageUrl}
                  alt={item.productName}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-brand-text">
                {item.productName}
              </p>
              <p className="text-xs text-brand-text/60">
                {item.variantLabel} · {item.quantity} adet
              </p>
            </div>
            <p className="text-sm font-medium text-brand-text">
              {formatTRY(item.lineTotal, { decimals: false })}
            </p>
          </li>
        ))}
      </ul>

      <div className="space-y-1.5 border-t border-brand-border pt-4 text-sm">
        <div className="flex justify-between text-brand-text/70">
          <span>Ara toplam</span>
          <span>{formatTRY(order.subtotal, { decimals: false })}</span>
        </div>
        <div className="flex justify-between text-brand-text/70">
          <span>Kargo</span>
          <span>
            {order.shippingFee > 0
              ? formatTRY(order.shippingFee, { decimals: false })
              : "Ücretsiz"}
          </span>
        </div>
        {order.discountAmount > 0 && (
          <div className="flex justify-between text-brand-text/70">
            <span>İndirim</span>
            <span>-{formatTRY(order.discountAmount, { decimals: false })}</span>
          </div>
        )}
        <div className="flex justify-between pt-1 font-display text-base font-bold text-brand-text">
          <span>Genel toplam</span>
          <span>{formatTRY(order.totalAmount, { decimals: false })}</span>
        </div>
      </div>

      <div className="mt-4 border-t border-brand-border pt-4 text-sm text-brand-text/70">
        <p className="font-semibold text-brand-text">Teslimat adresi</p>
        <p className="mt-1">
          {order.customerFirstName} {order.customerLastName}
        </p>
        <p>{order.shippingAddressLine}</p>
        <p>
          {order.shippingDistrict} / {order.shippingCity}
        </p>
      </div>
    </div>
  );
}
