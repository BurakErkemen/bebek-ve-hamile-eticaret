"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { OrderAdminStatus } from "@/server/domain/entities/order-admin.entity";

const STATUS_LABELS: Record<OrderAdminStatus, string> = {
  DRAFT: "Taslak",
  PENDING_PAYMENT: "Ödeme Bekleniyor",
  PROCESSING: "Hazırlanıyor",
  SHIPPED: "Kargoda",
  DELIVERED: "Teslim Edildi",
  CANCELLED: "İptal Edildi",
};

export default function OrderStatusForm({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderAdminStatus;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<OrderAdminStatus>(currentStatus);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === currentStatus) return;
    setLoading(true);
    await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as OrderAdminStatus)}
        className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {(Object.keys(STATUS_LABELS) as OrderAdminStatus[]).map((s) => (
          <option key={s} value={s}>{STATUS_LABELS[s]}</option>
        ))}
      </select>
      <button
        type="submit"
        disabled={loading || status === currentStatus}
        className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
      >
        {loading ? "Kaydediliyor..." : "Güncelle"}
      </button>
    </form>
  );
}
