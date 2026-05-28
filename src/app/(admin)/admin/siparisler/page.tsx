import Link from "next/link";
import { PrismaOrderAdminRepository } from "@/server/infrastructure/database/repositories/prisma-order-admin.repository";
import { ListOrdersUseCase } from "@/server/application/admin/orders/order-admin.use-cases";
import type { OrderAdminStatus, OrderAdminPaymentStatus } from "@/server/domain/entities/order-admin.entity";

const STATUS_LABELS: Record<OrderAdminStatus, string> = {
  DRAFT: "Taslak",
  PENDING_PAYMENT: "Ödeme Bekleniyor",
  PROCESSING: "Hazırlanıyor",
  SHIPPED: "Kargoda",
  DELIVERED: "Teslim Edildi",
  CANCELLED: "İptal Edildi",
};

const STATUS_COLORS: Record<OrderAdminStatus, string> = {
  DRAFT: "bg-gray-100 text-gray-500",
  PENDING_PAYMENT: "bg-yellow-50 text-yellow-700",
  PROCESSING: "bg-blue-50 text-blue-700",
  SHIPPED: "bg-indigo-50 text-indigo-700",
  DELIVERED: "bg-green-50 text-green-700",
  CANCELLED: "bg-red-50 text-red-600",
};

const PAYMENT_LABELS: Record<OrderAdminPaymentStatus, string> = {
  NOT_STARTED: "Başlamadı",
  PENDING: "Bekliyor",
  SUCCESS: "Başarılı",
  FAILED: "Başarısız",
  REFUNDED: "İade Edildi",
};

const PAYMENT_COLORS: Record<OrderAdminPaymentStatus, string> = {
  NOT_STARTED: "bg-gray-100 text-gray-500",
  PENDING: "bg-yellow-50 text-yellow-700",
  SUCCESS: "bg-green-50 text-green-700",
  FAILED: "bg-red-50 text-red-600",
  REFUNDED: "bg-purple-50 text-purple-700",
};

type SearchParams = Promise<{ status?: string }>;

export default async function AdminOrdersPage({ searchParams }: { searchParams: SearchParams }) {
  const { status } = await searchParams;
  const repo = new PrismaOrderAdminRepository();
  const orders = await new ListOrdersUseCase(repo).execute(
    status ? { status: status as OrderAdminStatus } : undefined
  );

  const filterLinks: { label: string; value: string | null }[] = [
    { label: "Tümü", value: null },
    { label: "Ödeme Bekleniyor", value: "PENDING_PAYMENT" },
    { label: "Hazırlanıyor", value: "PROCESSING" },
    { label: "Kargoda", value: "SHIPPED" },
    { label: "Teslim Edildi", value: "DELIVERED" },
    { label: "İptal Edildi", value: "CANCELLED" },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Siparişler</h1>
        <span className="text-sm text-gray-500">{orders.length} sipariş</span>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {filterLinks.map((f) => {
          const href = f.value ? `/admin/siparisler?status=${f.value}` : "/admin/siparisler";
          const isActive = (status ?? null) === f.value;
          return (
            <Link
              key={f.label}
              href={href}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                isActive
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"
              }`}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {orders.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">Sipariş bulunamadı.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left">
                <th className="px-4 py-3 font-medium text-gray-500">Sipariş No</th>
                <th className="px-4 py-3 font-medium text-gray-500">Müşteri</th>
                <th className="px-4 py-3 font-medium text-gray-500">Durum</th>
                <th className="px-4 py-3 font-medium text-gray-500">Ödeme</th>
                <th className="px-4 py-3 font-medium text-gray-500 text-right">Tutar</th>
                <th className="px-4 py-3 font-medium text-gray-500 text-right">Tarih</th>
                <th className="px-4 py-3 font-medium text-gray-500 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs font-medium text-gray-700">{o.orderNumber}</span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{o.customerFirstName} {o.customerLastName}</p>
                    <p className="text-gray-400 text-xs">{o.customerEmail}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[o.status]}`}>
                      {STATUS_LABELS[o.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${PAYMENT_COLORS[o.paymentStatus]}`}>
                      {PAYMENT_LABELS[o.paymentStatus]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-gray-800">
                    {parseFloat(o.totalAmount).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺
                  </td>
                  <td className="px-4 py-3 text-right text-gray-500 text-xs">
                    {new Date(o.createdAt).toLocaleDateString("tr-TR")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/siparisler/${o.id}`}
                      className="text-indigo-600 hover:text-indigo-800 text-xs font-medium"
                    >
                      Detay
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
