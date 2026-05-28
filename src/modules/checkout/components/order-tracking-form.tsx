"use client";

import { useState, type FormEvent } from "react";
import type {
  OrderSummary,
  OrderSummaryPaymentStatus,
  OrderSummaryStatus,
} from "@/server/domain/entities/order-summary.entity";
import { OrderSummaryCard } from "@/modules/checkout/components/order-summary-card";

const STATUS_LABELS: Record<OrderSummaryStatus, string> = {
  DRAFT: "Taslak",
  PENDING_PAYMENT: "Ödeme bekleniyor",
  PROCESSING: "Hazırlanıyor",
  SHIPPED: "Kargoya verildi",
  DELIVERED: "Teslim edildi",
  CANCELLED: "İptal edildi",
};

const PAYMENT_STATUS_LABELS: Record<OrderSummaryPaymentStatus, string> = {
  NOT_STARTED: "Başlatılmadı",
  PENDING: "Onay bekleniyor",
  SUCCESS: "Ödendi",
  FAILED: "Başarısız",
  REFUNDED: "İade edildi",
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

export function OrderTrackingForm() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState<OrderSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setOrder(null);

    const response = await fetch("/api/order-lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderNumber, email }),
    });

    const data = (await response.json().catch(() => ({}))) as {
      order?: OrderSummary;
      message?: string;
    };

    if (response.ok && data.order) {
      setOrder(data.order);
    } else {
      setError(data.message ?? "Sipariş sorgulanamadı.");
    }

    setIsSubmitting(false);
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={handleSubmit}
        className="rounded-[var(--radius-brand-xl)] border border-brand-border bg-brand-white p-5 md:p-6"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="orderNumber"
              className="mb-1 block text-sm font-medium text-brand-text"
            >
              Sipariş numarası
            </label>
            <input
              id="orderNumber"
              type="text"
              required
              value={orderNumber}
              onChange={(event) => setOrderNumber(event.target.value)}
              placeholder="BH-20260101-XXXXXXXX"
              className="w-full rounded-lg border border-brand-border px-3 py-2 text-sm text-brand-text outline-none transition focus:border-brand-primary"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-brand-text"
            >
              E-posta
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="ornek@eposta.com"
              className="w-full rounded-lg border border-brand-border px-3 py-2 text-sm text-brand-text outline-none transition focus:border-brand-primary"
            />
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 inline-flex items-center justify-center rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold text-brand-white transition hover:bg-brand-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Sorgulanıyor…" : "Siparişi Sorgula"}
        </button>
      </form>

      {order && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusToneClass(order.status)}`}
            >
              {STATUS_LABELS[order.status]}
            </span>
            <span className="inline-flex items-center rounded-full bg-brand-secondary px-3 py-1 text-xs font-semibold text-brand-text">
              Ödeme: {PAYMENT_STATUS_LABELS[order.paymentStatus]}
            </span>
          </div>
          <OrderSummaryCard order={order} />
        </div>
      )}
    </div>
  );
}
