
import { formatTRY } from "@/shared/utils/format-currency";
type TrustItem = {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
};

export function TrustBar({
  freeShippingThreshold,
}: {
  freeShippingThreshold?: number | null;
}) {
  const shippingSubtitle =
    freeShippingThreshold && freeShippingThreshold > 0
      ? `${formatTRY(freeShippingThreshold, { decimals: false })} ve üzeri siparişlerde`
      : "Türkiye geneli hızlı teslimat";

  const items: TrustItem[] = [
    {
      title: "Ücretsiz Kargo",
      subtitle: shippingSubtitle,
      icon: (
        <path d="M3 7.5h11v9H3v-9Zm11 3h4l3 3v3h-7v-6ZM7 19.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
      ),
    },
    {
      title: "Güvenli Ödeme",
      subtitle: "256-bit SSL · PayTR altyapısı",
      icon: (
        <path d="M12 3 5 6v5c0 4.2 2.9 7.9 7 9 4.1-1.1 7-4.8 7-9V6l-7-3Zm-1.2 11.4L8 11.6l1.3-1.3 1.5 1.5 3.9-3.9L16 9.2l-5.2 5.2Z" />
      ),
    },
    {
      title: "Kolay İade",
      subtitle: "14 gün içinde koşulsuz",
      icon: (
        <path d="M4 12a8 8 0 1 1 2.3 5.6M4 12V7m0 5h5" />
      ),
    },
    {
      title: "Yanınızdayız",
      subtitle: "Hafta içi her gün destek",
      icon: (
        <path d="M4 12a8 8 0 0 1 16 0v5a2 2 0 0 1-2 2h-2v-6h4M4 12v5a2 2 0 0 0 2 2h2v-6H4" />
      ),
    },
  ];

  return (
    <section className="border-b border-brand-border bg-brand-white">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-2 divide-x divide-brand-border md:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.title}
            className="flex items-center gap-3 px-4 py-3.5 md:justify-center md:px-3"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 text-brand-primary"
              aria-hidden
            >
              {item.icon}
            </svg>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-brand-text">
                {item.title}
              </p>
              <p className="truncate text-[11px] text-brand-muted">
                {item.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
