import type {
  HeroSlide,
  HomeCategoryCard,
} from "@/modules/home/types/home-content.types";

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