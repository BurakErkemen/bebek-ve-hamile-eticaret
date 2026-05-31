import Image from "next/image";
import Link from "next/link";
import { getCachedNavCategories } from "@/server/application/layout/get-nav-categories.cached";
import { getCachedSiteSettings } from "@/server/application/layout/get-site-settings.cached";
import { getCachedCorporatePageStatuses } from "@/server/application/layout/get-pages.cached";
import { getCachedPublishedBlogPosts } from "@/server/application/blog/get-blog-posts.cached";
import { CORPORATE_PAGES } from "@/server/domain/entities/corporate-pages";
import { SETTING_KEYS } from "@/server/domain/entities/site-setting.entity";

const TRUST = [
  { icon: "🚚", title: "Hızlı Kargo", sub: "2–4 iş günü" },
  { icon: "🔄", title: "Kolay İade", sub: "14 gün ücretsiz" },
  { icon: "🔒", title: "Güvenli Ödeme", sub: "SSL şifreli" },
  { icon: "💬", title: "Destek", sub: "Hft içi 09–18" },
] as const;

const SOCIAL_ICONS: Record<string, string> = {
  [SETTING_KEYS.SOCIAL_INSTAGRAM]: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
  [SETTING_KEYS.SOCIAL_FACEBOOK]:  "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  [SETTING_KEYS.SOCIAL_TIKTOK]:    "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z",
  [SETTING_KEYS.SOCIAL_YOUTUBE]:   "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  [SETTING_KEYS.SOCIAL_TWITTER]:   "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
};

export async function Footer() {
  const [categories, settings, pageStatuses, blogPosts] = await Promise.all([
    getCachedNavCategories(),
    getCachedSiteSettings(),
    getCachedCorporatePageStatuses(),
    getCachedPublishedBlogPosts(),
  ]);

  const corporateLinks = CORPORATE_PAGES.flatMap(def => {
    const status = pageStatuses[def.slug];
    if (!status?.isActive) return [];
    if (def.contentGated && !status.hasContent) return [];
    return [{ label: def.title, href: `/sayfa/${def.slug}` }];
  });
  if (blogPosts.length > 0) corporateLinks.push({ label: "Blog", href: "/blog" });

  const email   = settings[SETTING_KEYS.FOOTER_EMAIL];
  const phone   = settings[SETTING_KEYS.FOOTER_PHONE];
  const address = settings[SETTING_KEYS.FOOTER_ADDRESS];

  const socials = Object.entries(SOCIAL_ICONS)
    .filter(([key]) => settings[key])
    .map(([key, icon]) => ({ href: settings[key], icon, label: key.replace("social_", "") }));

  return (
    <footer className="mt-20">
      {/* Güven şeridi */}
      <div className="border-y border-border bg-surface-warm">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-center gap-8 px-4 py-6 md:gap-16 md:px-6">
          {TRUST.map(item => (
            <div key={item.title} className="flex items-center gap-3">
              <span className="text-2xl" aria-hidden="true">{item.icon}</span>
              <div>
                <p className="text-xs font-bold text-ink">{item.title}</p>
                <p className="text-[11px] text-ink-3">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ana footer */}
      <div className="bg-surface-card">
        <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-[1.2fr_2fr]">

            {/* Sol */}
            <div>
              <Image src="/logo.png" alt="Dastini" width={313} height={125} className="h-10 w-auto" />
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-3">
                Bodrum Oasis AVM&apos;nin sevilen mağazası, bebek ve hamile giyimini online&apos;a taşıyor.
              </p>

              {(email || phone || address) && (
                <ul className="mt-6 space-y-2 text-sm text-ink-3">
                  {email && (
                    <li><a href={`mailto:${email}`} className="transition hover:text-amber">{email}</a></li>
                  )}
                  {phone && (
                    <li><a href={`tel:${phone}`} className="transition hover:text-amber">{phone}</a></li>
                  )}
                  {address && <li>{address}</li>}
                </ul>
              )}

              {socials.length > 0 && (
                <div className="mt-6 flex items-center gap-2">
                  {socials.map(s => (
                    <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer"
                      aria-label={s.label}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink-3 transition-all duration-200 hover:border-amber hover:text-amber">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d={s.icon} />
                      </svg>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Sağ */}
            <div className="grid gap-8 sm:grid-cols-3">
              {corporateLinks.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-ink">Kurumsal</h3>
                  <ul className="mt-4 space-y-3">
                    {corporateLinks.map(link => (
                      <li key={link.href}>
                        <Link href={link.href} className="text-sm text-ink-3 transition hover:text-amber">{link.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-ink">Yardım</h3>
                <ul className="mt-4 space-y-3">
                  {[
                    { label: "Sipariş Takibi", href: "/siparis-takibi" },
                    { label: "İade ve Değişim", href: "#" },
                    { label: "Sık Sorulan Sorular", href: "#" },
                  ].map(item => (
                    <li key={item.label}>
                      <Link href={item.href} className="text-sm text-ink-3 transition hover:text-amber">{item.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              {categories.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-ink">Kategoriler</h3>
                  <ul className="mt-4 space-y-3">
                    {categories.slice(0, 5).map(cat => (
                      <li key={cat.id}>
                        <Link href={`/kategori/${cat.slug}`} className="text-sm text-ink-3 transition hover:text-amber">{cat.name}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-border-light">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-4 text-xs text-ink-4 md:flex-row md:items-center md:justify-between md:px-6">
            <p>© {new Date().getFullYear()} Dastini Bebe Market. Tüm hakları saklıdır.</p>
            <div className="flex items-center gap-4">
              {corporateLinks.slice(0, 2).map(link => (
                <Link key={link.href} href={link.href} className="transition hover:text-amber">{link.label}</Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
