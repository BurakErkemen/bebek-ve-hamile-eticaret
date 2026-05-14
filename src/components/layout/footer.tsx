import Link from "next/link";

const footerLinks = [
  {
    title: "Kurumsal",
    items: [
      { label: "Hakkımızda", href: "#" },
      { label: "İletişim", href: "#" },
      { label: "Mesafeli Satış Sözleşmesi", href: "#" },
    ],
  },
  {
    title: "Müşteri Hizmetleri",
    items: [
      { label: "Sipariş Takibi", href: "#" },
      { label: "İade ve Değişim", href: "#" },
      { label: "Sık Sorulan Sorular", href: "#" },
    ],
  },
  {
    title: "Kategoriler",
    items: [
      { label: "Bebek Giyim", href: "/kategori/bebek-giyim" },
      { label: "Hamile Giyim", href: "/kategori/hamile-giyim" },
      { label: "Anne Bebek", href: "/kategori/anne-bebek" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-brand-border bg-brand-white">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 md:grid-cols-[1.2fr_2fr] md:px-6 lg:px-8">
        <div>
          <h2 className="font-display text-2xl font-bold text-brand-text">
            Bebek & Hamile
          </h2>

          <p className="mt-4 max-w-md text-sm leading-7 text-brand-muted">
            Bebek, anne ve hamile giyim kategorilerinde güven veren, sade ve
            hızlı alışveriş deneyimi için geliştirilen modern e-ticaret altyapısı.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="font-display text-base font-bold text-brand-text">
                {group.title}
              </h3>

              <ul className="mt-4 space-y-3">
                {group.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-brand-muted transition hover:text-brand-primary-dark"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-brand-border">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-5 text-sm text-brand-muted md:flex-row md:items-center md:justify-between md:px-6 lg:px-8">
          <p>© 2026 Bebek & Hamile. Tüm hakları saklıdır.</p>
          <p>Güvenli alışveriş altyapısı hazırlanıyor.</p>
        </div>
      </div>
    </footer>
  );
}