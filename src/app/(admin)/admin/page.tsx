import { prisma } from "@/server/infrastructure/database/prisma/prisma-client";
import Link from "next/link";

const statCards = (
  productCount: number,
  categoryCount: number,
  orderCount: number,
  pendingOrders: number
) => [
  {
    label: "Aktif Ürün",
    value: productCount,
    href: "/admin/urunler",
    color: "indigo",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
        <path d="M6 6h.008v.008H6V6Z" />
      </svg>
    ),
  },
  {
    label: "Kategori",
    value: categoryCount,
    href: "/admin/kategoriler",
    color: "violet",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
        <path d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
      </svg>
    ),
  },
  {
    label: "Toplam Sipariş",
    value: orderCount,
    href: "/admin/siparisler",
    color: "sky",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
        <path d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
      </svg>
    ),
  },
  {
    label: "Bekleyen Ödeme",
    value: pendingOrders,
    href: "/admin/siparisler",
    color: "amber",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
];

const colorMap: Record<string, { bg: string; text: string; ring: string }> = {
  indigo: { bg: "bg-indigo-50", text: "text-indigo-600", ring: "ring-indigo-100" },
  violet: { bg: "bg-violet-50", text: "text-violet-600", ring: "ring-violet-100" },
  sky:    { bg: "bg-sky-50",    text: "text-sky-600",    ring: "ring-sky-100" },
  amber:  { bg: "bg-amber-50",  text: "text-amber-600",  ring: "ring-amber-100" },
};

export default async function AdminDashboard() {
  const [productCount, categoryCount, orderCount, pendingOrders] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }),
    prisma.category.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING_PAYMENT" } }),
  ]);

  const cards = statCards(productCount, categoryCount, orderCount, pendingOrders);

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Mağazanıza genel bir bakış.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => {
          const c = colorMap[card.color];
          return (
            <Link
              key={card.label}
              href={card.href}
              className="group bg-white rounded-xl border border-gray-100 p-5 hover:border-gray-200 hover:shadow-sm transition-all"
            >
              <div className={`w-9 h-9 rounded-lg ${c.bg} ring-1 ${c.ring} flex items-center justify-center mb-3`}>
                <span className={c.text}>{card.icon}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 tabular-nums">{card.value}</p>
              <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                {card.label}
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="opacity-0 group-hover:opacity-100 transition-opacity" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </p>
            </Link>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="text-sm font-medium text-gray-700 mb-3">Hızlı İşlemler</h2>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/urunler/yeni"
            className="inline-flex items-center gap-1.5 bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Yeni Ürün
          </Link>
          <Link
            href="/admin/kategoriler/yeni"
            className="inline-flex items-center gap-1.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Yeni Kategori
          </Link>
          <Link
            href="/admin/siparisler"
            className="inline-flex items-center gap-1.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Siparişleri Görüntüle
          </Link>
        </div>
      </div>
    </div>
  );
}
