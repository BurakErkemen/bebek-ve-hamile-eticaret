export type CorporatePageDef = {
  slug: string;
  title: string;
  /** İçeriği boşsa footer'da gizlenir (örn. Hizmetler). */
  contentGated: boolean;
};

export const CORPORATE_PAGES: CorporatePageDef[] = [
  { slug: "hakkimizda", title: "Hakkımızda", contentGated: false },
  { slug: "hizmetler", title: "Hizmetler", contentGated: true },
  { slug: "gizlilik-ilkeleri", title: "Gizlilik İlkeleri", contentGated: false },
  { slug: "sartlar-ve-kosullar", title: "Şartlar ve Koşullar", contentGated: false },
  { slug: "teslimat-bilgileri", title: "Teslimat Bilgileri", contentGated: false },
];

export const CORPORATE_PAGE_SLUGS = CORPORATE_PAGES.map((p) => p.slug);

export function getCorporatePageDef(slug: string): CorporatePageDef | undefined {
  return CORPORATE_PAGES.find((p) => p.slug === slug);
}
