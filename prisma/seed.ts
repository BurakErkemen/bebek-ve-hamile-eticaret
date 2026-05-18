import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import {
  BannerPlacement,
  HomeSectionItemType,
  HomeSectionType,
  PrismaClient,
  SliderPlacement,
  VisualTone,
} from "../src/generated/prisma/client";

function createMariaDbAdapter() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not defined.");
  }

  const parsedUrl = new URL(databaseUrl);

  return new PrismaMariaDb({
    host: parsedUrl.hostname,
    port: Number(parsedUrl.port || 3306),
    user: decodeURIComponent(parsedUrl.username),
    password: decodeURIComponent(parsedUrl.password),
    database: parsedUrl.pathname.replace("/", ""),
    connectionLimit: 5,
  });
}

const prisma = new PrismaClient({
  adapter: createMariaDbAdapter(),
});

async function clearSeedData() {
  await prisma.homeSectionItem.deleteMany();
  await prisma.homeSection.deleteMany();
  await prisma.sliderSlide.deleteMany();
  await prisma.slider.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.category.deleteMany();
}

async function seedCategories() {
  const babyClothing = await prisma.category.create({
    data: {
      name: "Bebek Giyim",
      slug: "bebek-giyim",
      description:
        "Tulum, takım, hastane çıkışı ve günlük bebek giyim ürünleri.",
      sortOrder: 1,
      isActive: true,
    },
  });

  const maternityClothing = await prisma.category.create({
    data: {
      name: "Hamile Giyim",
      slug: "hamile-giyim",
      description:
        "Anne adaylarına özel konforlu ve modern hamile giyim ürünleri.",
      sortOrder: 2,
      isActive: true,
    },
  });

  const motherBaby = await prisma.category.create({
    data: {
      name: "Anne Bebek",
      slug: "anne-bebek",
      description:
        "Anne ve bebek ihtiyaçlarını tamamlayan yardımcı ürünler.",
      sortOrder: 3,
      isActive: true,
    },
  });

  return {
    babyClothing,
    maternityClothing,
    motherBaby,
  };
}

async function seedHeroSlider() {
  return prisma.slider.create({
    data: {
      name: "Ana Sayfa Hero Slider",
      placement: SliderPlacement.HOME_HERO,
      sortOrder: 1,
      isActive: true,
      slides: {
        create: [
          {
            eyebrow: "Yeni sezon",
            title:
              "Bebek giyimde yumuşak, zarif ve güven veren seçimler",
            description:
              "Günlük kullanım, özel gün ve hediye alternatifleri için özenle seçilmiş bebek ürünleri.",
            primaryActionLabel: "Bebek Giyimi İncele",
            primaryActionHref: "/kategori/bebek-giyim",
            secondaryActionLabel: "Yeni Gelenler",
            secondaryActionHref: "/kategori/bebek-giyim?sort=newest",
            imageAlt: "Bebek giyim koleksiyonu",
            tone: VisualTone.ROSE,
            sortOrder: 1,
            isActive: true,
          },
          {
            eyebrow: "Konfor odaklı",
            title:
              "Hamile giyimde gün boyu rahatlık ve modern görünüm",
            description:
              "Anne adayları için hareket özgürlüğünü destekleyen, zarif ve fonksiyonel parçalar.",
            primaryActionLabel: "Hamile Giyimi Keşfet",
            primaryActionHref: "/kategori/hamile-giyim",
            secondaryActionLabel: "Kombin Önerileri",
            secondaryActionHref: "/kampanyalar",
            imageAlt: "Hamile giyim ürünleri",
            tone: VisualTone.SAGE,
            sortOrder: 2,
            isActive: true,
          },
          {
            eyebrow: "Anne & Bebek",
            title:
              "Anne ve bebek ihtiyaçlarını tek mağazada buluşturuyoruz",
            description:
              "Bakım, günlük ihtiyaç ve hediye kategorilerinde düzenli ve hızlı alışveriş akışı.",
            primaryActionLabel: "Anne Bebek Ürünleri",
            primaryActionHref: "/kategori/anne-bebek",
            secondaryActionLabel: "Kampanyalar",
            secondaryActionHref: "/kampanyalar",
            imageAlt: "Anne bebek ürünleri",
            tone: VisualTone.PEACH,
            sortOrder: 3,
            isActive: true,
          },
        ],
      },
    },
  });
}

async function seedPromoBanner() {
  return prisma.banner.create({
    data: {
      name: "Ana Sayfa Kampanya Bannerı",
      placement: BannerPlacement.HOME_PROMO,
      eyebrow: "Kampanya Alanı",
      title:
        "İlk siparişe özel avantaj blokları için hazır mimari",
      description:
        "Bu alan admin panelden metin, buton, görsel ve aktiflik durumu yönetilebilen banner sistemine dönüşecek.",
      actionLabel: "Kampanyaları Gör",
      actionHref: "/kampanyalar",
      tone: VisualTone.ROSE,
      sortOrder: 1,
      isActive: true,
    },
  });
}

async function seedHomeSections(input: {
  sliderId: string;
  bannerId: string;
}) {
  await prisma.homeSection.create({
    data: {
      type: HomeSectionType.HERO_SLIDER,
      sliderId: input.sliderId,
      sortOrder: 1,
      isActive: true,
    },
  });

  await prisma.homeSection.create({
    data: {
      type: HomeSectionType.CATEGORY_SHOWCASE,
      eyebrow: "Kategoriler",
      title: "Ana alışveriş alanları",
      description:
        "Bebek, hamile ve anne-bebek kategorilerinde hızlı keşif alanı.",
      sortOrder: 2,
      isActive: true,
      items: {
        create: [
          {
            itemType: HomeSectionItemType.CATEGORY_CARD,
            title: "Bebek Giyim",
            description:
              "Tulum, takım, hastane çıkışı ve günlük bebek ürünleri.",
            href: "/kategori/bebek-giyim",
            badge: "Popüler",
            tone: VisualTone.ROSE,
            sortOrder: 1,
            isActive: true,
          },
          {
            itemType: HomeSectionItemType.CATEGORY_CARD,
            title: "Hamile Giyim",
            description:
              "Elbise, pijama, tayt ve anne adaylarına özel konfor ürünleri.",
            href: "/kategori/hamile-giyim",
            badge: "Yeni",
            tone: VisualTone.SAGE,
            sortOrder: 2,
            isActive: true,
          },
          {
            itemType: HomeSectionItemType.CATEGORY_CARD,
            title: "Anne Bebek",
            description:
              "Bakım ürünleri, yardımcı aksesuarlar ve günlük ihtiyaçlar.",
            href: "/kategori/anne-bebek",
            badge: "Seçili",
            tone: VisualTone.PEACH,
            sortOrder: 3,
            isActive: true,
          },
        ],
      },
    },
  });

  await prisma.homeSection.create({
    data: {
      type: HomeSectionType.PROMO_BANNER,
      bannerId: input.bannerId,
      sortOrder: 3,
      isActive: true,
    },
  });
}

async function main() {
  console.log("Seed işlemi başlatıldı...");

  await clearSeedData();

  await seedCategories();

  const slider = await seedHeroSlider();
  const banner = await seedPromoBanner();

  await seedHomeSections({
    sliderId: slider.id,
    bannerId: banner.id,
  });

  console.log("Seed işlemi tamamlandı.");
}

main()
  .catch((error) => {
    console.error("Seed işlemi başarısız:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });