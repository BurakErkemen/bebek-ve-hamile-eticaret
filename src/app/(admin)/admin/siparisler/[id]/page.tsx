import { notFound } from "next/navigation";
import Link from "next/link";
import { PrismaOrderAdminRepository } from "@/server/infrastructure/database/repositories/prisma-order-admin.repository";
import { GetOrderAdminUseCase } from "@/server/application/admin/orders/order-admin.use-cases";
import OrderStatusForm from "@/modules/admin/components/orders/order-status-form";
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

type PageParams = { params: Promise<{ id: string }> };

export default async function OrderDetailPage({ params }: PageParams) {
  const { id } = await params;
  const repo = new PrismaOrderAdminRepository();
  const order = await new GetOrderAdminUseCase(repo).execute(id);
  if (!order) notFound();

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/siparisler" className="text-sm text-gray-500 hover:text-gray-700">
          ← Siparişler
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-semibold text-gray-800 font-mono">{order.orderNumber}</h1>
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[order.status]}`}>
          {STATUS_LABELS[order.status]}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Müşteri Bilgileri</h2>
          <dl className="space-y-1.5 text-sm">
            <div className="flex gap-2">
              <dt className="text-gray-500 w-24 shrink-0">Ad Soyad</dt>
              <dd className="text-gray-800 font-medium">{order.customerFirstName} {order.customerLastName}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-gray-500 w-24 shrink-0">E-posta</dt>
              <dd className="text-gray-800">{order.customerEmail}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-gray-500 w-24 shrink-0">Telefon</dt>
              <dd className="text-gray-800">{order.customerPhone}</dd>
            </div>
            {order.customerNote && (
              <div className="flex gap-2">
                <dt className="text-gray-500 w-24 shrink-0">Not</dt>
                <dd className="text-gray-800 italic">{order.customerNote}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Teslimat Adresi</h2>
          <p className="text-sm text-gray-800">
            {order.shippingAddressLine}
          </p>
          <p className="text-sm text-gray-700 mt-1">
            {order.shippingNeighborhood && `${order.shippingNeighborhood}, `}
            {order.shippingDistrict}, {order.shippingCity}
          </p>
          {order.shippingPostalCode && (
            <p className="text-sm text-gray-500">{order.shippingPostalCode} / {order.shippingCountry}</p>
          )}
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Ödeme Bilgileri</h2>
          <dl className="space-y-1.5 text-sm">
            <div className="flex gap-2">
              <dt className="text-gray-500 w-28 shrink-0">Ödeme Durumu</dt>
              <dd>
                <span className="font-medium text-gray-800">{PAYMENT_LABELS[order.paymentStatus]}</span>
              </dd>
            </div>
            {order.merchantOid && (
              <div className="flex gap-2">
                <dt className="text-gray-500 w-28 shrink-0">Merchant OID</dt>
                <dd className="text-gray-700 font-mono text-xs">{order.merchantOid}</dd>
              </div>
            )}
            {order.paidAt && (
              <div className="flex gap-2">
                <dt className="text-gray-500 w-28 shrink-0">Ödeme Tarihi</dt>
                <dd className="text-gray-800">{new Date(order.paidAt).toLocaleString("tr-TR")}</dd>
              </div>
            )}
            {order.paymentFailureMessage && (
              <div className="flex gap-2">
                <dt className="text-gray-500 w-28 shrink-0">Hata</dt>
                <dd className="text-red-600">{order.paymentFailureMessage}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Sipariş Özeti</h2>
          <dl className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Ara Toplam</dt>
              <dd className="text-gray-800">{parseFloat(order.subtotal).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Kargo</dt>
              <dd className="text-gray-800">{parseFloat(order.shippingFee).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺</dd>
            </div>
            {parseFloat(order.discountAmount) > 0 && (
              <div className="flex justify-between">
                <dt className="text-gray-500">İndirim</dt>
                <dd className="text-green-600">-{parseFloat(order.discountAmount).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺</dd>
              </div>
            )}
            <div className="flex justify-between border-t border-gray-100 pt-1.5 font-semibold">
              <dt className="text-gray-700">Toplam</dt>
              <dd className="text-gray-900">{parseFloat(order.totalAmount).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Sipariş Kalemleri</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left">
              <th className="pb-2 font-medium text-gray-500">Ürün</th>
              <th className="pb-2 font-medium text-gray-500">SKU</th>
              <th className="pb-2 font-medium text-gray-500 text-right">Birim Fiyat</th>
              <th className="pb-2 font-medium text-gray-500 text-right">Adet</th>
              <th className="pb-2 font-medium text-gray-500 text-right">Toplam</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-b border-gray-100 last:border-0">
                <td className="py-2">
                  <p className="font-medium text-gray-800">{item.productName}</p>
                  {item.variantLabel && (
                    <p className="text-gray-400 text-xs">{item.variantLabel}</p>
                  )}
                </td>
                <td className="py-2 font-mono text-xs text-gray-500">{item.sku}</td>
                <td className="py-2 text-right text-gray-700">
                  {parseFloat(item.unitPrice).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺
                </td>
                <td className="py-2 text-right text-gray-700">{item.quantity}</td>
                <td className="py-2 text-right font-medium text-gray-800">
                  {parseFloat(item.lineTotal).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Sipariş Durumunu Güncelle</h2>
        <OrderStatusForm orderId={order.id} currentStatus={order.status} />
      </div>
    </div>
  );
}
