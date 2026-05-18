import type {
  HeroSlide,
  HomeCategoryCard,
  HomePromoBanner,
} from "@/modules/home/types/home-content.types";
import type { ProductCardItem } from "@/modules/product/types/product-card.types";

export const heroSlides: HeroSlide[] = [
  {
    id: "hero-slide-bebek-giyim",
    eyebrow: "Yeni sezon",
    title: "Bebek giyimde yumuşak, zarif ve güven veren seçimler",
    description:
      "Günlük kullanım, özel gün ve hediye alternatifleri için özenle seçilmiş bebek ürünleri.",
    primaryActionLabel: "Bebek Giyimi İncele",
    primaryActionHref: "/kategori/bebek-giyim",
    secondaryActionLabel: "Yeni Gelenler",
    secondaryActionHref: "/kategori/bebek-giyim?sort=newest",
    imageUrl: null,
    imageAlt: "Bebek giyim koleksiyonu",
    tone: "rose",
  },
  {
    id: "hero-slide-hamile-giyim",
    eyebrow: "Konfor odaklı",
    title: "Hamile giyimde gün boyu rahatlık ve modern görünüm",
    description:
      "Anne adayları için hareket özgürlüğünü destekleyen, zarif ve fonksiyonel parçalar.",
    primaryActionLabel: "Hamile Giyimi Keşfet",
    primaryActionHref: "/kategori/hamile-giyim",
    secondaryActionLabel: "Kombin Önerileri",
    secondaryActionHref: "/kampanyalar",
    imageUrl: null,
    imageAlt: "Hamile giyim ürünleri",
    tone: "sage",
  },
  {
    id: "hero-slide-anne-bebek",
    eyebrow: "Anne & Bebek",
    title: "Anne ve bebek ihtiyaçlarını tek mağazada buluşturuyoruz",
    description:
      "Bakım, günlük ihtiyaç ve hediye kategorilerinde düzenli ve hızlı alışveriş akışı.",
    primaryActionLabel: "Anne Bebek Ürünleri",
    primaryActionHref: "/kategori/anne-bebek",
    secondaryActionLabel: "Kampanyalar",
    secondaryActionHref: "/kampanyalar",
    imageUrl: null,
    imageAlt: "Anne bebek ürünleri",
    tone: "peach",
  },
];

export const homeCategoryCards: HomeCategoryCard[] = [
  {
    id: "category-bebek-giyim",
    title: "Bebek Giyim",
    description:
      "Tulum, takım, hastane çıkışı ve günlük bebek ürünleri.",
    href: "/kategori/bebek-giyim",
    badge: "Popüler",
    tone: "rose",
  },
  {
    id: "category-hamile-giyim",
    title: "Hamile Giyim",
    description:
      "Elbise, pijama, tayt ve anne adaylarına özel konfor ürünleri.",
    href: "/kategori/hamile-giyim",
    badge: "Yeni",
    tone: "sage",
  },
  {
    id: "category-anne-bebek",
    title: "Anne Bebek",
    description:
      "Bakım ürünleri, yardımcı aksesuarlar ve günlük ihtiyaçlar.",
    href: "/kategori/anne-bebek",
    badge: "Seçili",
    tone: "peach",
  },
];

export const homePromoBanner: HomePromoBanner = {
  id: "promo-banner-first-order",
  eyebrow: "Kampanya Alanı",
  title: "İlk siparişe özel avantaj blokları için hazır mimari",
  description:
    "Bu alan daha sonra admin panelden metin, buton, görsel ve aktiflik durumu yönetilebilen banner sistemine dönüşecek.",
  actionLabel: "Kampanyaları Gör",
  actionHref: "/kampanyalar",
  tone: "rose",
};

export const featuredProducts: ProductCardItem[] = [
  {
    id: "product-organik-tulum",
    name: "Organik Pamuk Bebek Tulum",
    slug: "organik-pamuk-bebek-tulum",
    categoryLabel: "Bebek Giyim",
    price: 549.9,
    compareAtPrice: 699.9,
    badge: "Öne Çıkan",
    imageUrl: null,
    imageAlt: "Organik pamuk bebek tulum",
    tone: "rose",
  },
  {
    id: "product-hamile-elbise",
    name: "Rahat Kesim Hamile Elbisesi",
    slug: "rahat-kesim-hamile-elbisesi",
    categoryLabel: "Hamile Giyim",
    price: 899.9,
    compareAtPrice: 1099.9,
    badge: "Yeni",
    imageUrl: null,
    imageAlt: "Rahat kesim hamile elbisesi",
    tone: "sage",
  },
  {
    id: "product-bebek-bakim-seti",
    name: "Anne Bebek Bakım Başlangıç Seti",
    slug: "anne-bebek-bakim-baslangic-seti",
    categoryLabel: "Anne Bebek",
    price: 749.9,
    badge: "Seçili",
    imageUrl: null,
    imageAlt: "Anne bebek bakım başlangıç seti",
    tone: "peach",
  },
  {
    id: "product-hastane-cikisi",
    name: "10 Parça Hastane Çıkışı Seti",
    slug: "10-parca-hastane-cikisi-seti",
    categoryLabel: "Bebek Giyim",
    price: 1299.9,
    compareAtPrice: 1499.9,
    badge: "Çok Satan",
    imageUrl: null,
    imageAlt: "Hastane çıkışı seti",
    tone: "rose",
  },
];