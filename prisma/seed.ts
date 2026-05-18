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

  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();

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

async function seedProducts(categories: {
  babyClothing: { id: string };
  maternityClothing: { id: string };
  motherBaby: { id: string };
}) {
  const organicBabyRomper = await prisma.product.create({
    data: {
      categoryId: categories.babyClothing.id,
      name: "Organik Pamuk Bebek Tulum",
      slug: "organik-pamuk-bebek-tulum",
      shortDescription:
        "Yumuşak dokulu, günlük kullanıma uygun organik pamuk tulum.",
      description:
        "Hassas bebek cildi düşünülerek tasarlanan organik pamuk tulum; çıtçıtlı yapısı, konforlu kalıbı ve pastel renk seçenekleriyle günlük kullanım için uygundur.",
      basePrice: "549.90",
      compareAtPrice: "699.90",
      isActive: true,
      isFeatured: true,
      sortOrder: 1,
      variants: {
        create: [
          {
            sku: "BT-ORG-03-EKRU",
            size: "0-3 Ay",
            colorName: "Ekru",
            colorHex: "#F6EFE7",
            stockQuantity: 18,
            sortOrder: 1,
            isActive: true,
          },
          {
            sku: "BT-ORG-36-PUDRA",
            size: "3-6 Ay",
            colorName: "Pudra",
            colorHex: "#F2D6DC",
            stockQuantity: 12,
            sortOrder: 2,
            isActive: true,
          },
        ],
      },
      images: {
        create: [
          {
            url: "/placeholders/products/bebek-tulum.svg",
            alt: "Organik pamuk bebek tulum görseli",
            isPrimary: true,
            sortOrder: 1,
          },
        ],
      },
    },
  });

  const maternityDress = await prisma.product.create({
    data: {
      categoryId: categories.maternityClothing.id,
      name: "Rahat Kesim Hamile Elbisesi",
      slug: "rahat-kesim-hamile-elbisesi",
      shortDescription:
        "Günlük kullanım için tasarlanmış, esnek ve rahat kesimli elbise.",
      description:
        "Hamilelik sürecinde vücut değişimine uyum sağlayan, nefes alabilir kumaşı ve sade çizgisiyle günlük kombinlerde kullanılabilecek rahat kesim elbise.",
      basePrice: "899.90",
      compareAtPrice: "1099.90",
      isActive: true,
      isFeatured: true,
      sortOrder: 2,
      variants: {
        create: [
          {
            sku: "HG-ELB-S-GUL",
            size: "S",
            colorName: "Gül Kurusu",
            colorHex: "#C9929B",
            stockQuantity: 8,
            sortOrder: 1,
            isActive: true,
          },
          {
            sku: "HG-ELB-M-GUL",
            size: "M",
            colorName: "Gül Kurusu",
            colorHex: "#C9929B",
            stockQuantity: 11,
            sortOrder: 2,
            isActive: true,
          },
          {
            sku: "HG-ELB-L-GUL",
            size: "L",
            colorName: "Gül Kurusu",
            colorHex: "#C9929B",
            stockQuantity: 7,
            sortOrder: 3,
            isActive: true,
          },
        ],
      },
      images: {
        create: [
          {
            url: "/placeholders/products/hamile-elbise.svg",
            alt: "Rahat kesim hamile elbisesi görseli",
            isPrimary: true,
            sortOrder: 1,
          },
        ],
      },
    },
  });

  const careStarterSet = await prisma.product.create({
    data: {
      categoryId: categories.motherBaby.id,
      name: "Anne Bebek Bakım Başlangıç Seti",
      slug: "anne-bebek-bakim-baslangic-seti",
      shortDescription:
        "Yeni doğan bakım rutinine uygun başlangıç paketi.",
      description:
        "Anne ve bebek bakımında temel ihtiyaçları bir araya getiren örnek ürün seti. Bu kayıt ileride gerçek bakım kategorisi ürünleriyle genişletilecek.",
      basePrice: "749.90",
      compareAtPrice: null,
      isActive: true,
      isFeatured: true,
      sortOrder: 3,
      variants: {
        create: [
          {
            sku: "AB-BKM-SET-ST",
            size: "Standart",
            colorName: "Natural",
            colorHex: "#E9DDCF",
            stockQuantity: 20,
            sortOrder: 1,
            isActive: true,
          },
        ],
      },
      images: {
        create: [
          {
            url: "/placeholders/products/bakim-seti.svg",
            alt: "Anne bebek bakım başlangıç seti görseli",
            isPrimary: true,
            sortOrder: 1,
          },
        ],
      },
    },
  });

  const hospitalExitSet = await prisma.product.create({
    data: {
      categoryId: categories.babyClothing.id,
      name: "10 Parça Hastane Çıkışı Seti",
      slug: "10-parca-hastane-cikisi-seti",
      shortDescription:
        "Yeni doğan hazırlığı için düzenlenmiş kapsamlı çıkış seti.",
      description:
        "Hastane sonrası ilk ihtiyaçları kapsayacak şekilde oluşturulan 10 parçalık bebek çıkış seti. Ürün vitrini, kategori filtreleri ve stok yönetimi senaryoları için örnek kayıt olarak kullanılacaktır.",
      basePrice: "1299.90",
      compareAtPrice: "1499.90",
      isActive: true,
      isFeatured: true,
      sortOrder: 4,
      variants: {
        create: [
          {
            sku: "BG-HCS-10P-BEYAZ",
            size: "Yeni Doğan",
            colorName: "Beyaz",
            colorHex: "#FFFFFF",
            stockQuantity: 9,
            sortOrder: 1,
            isActive: true,
          },
        ],
      },
      images: {
        create: [
          {
            url: "/placeholders/products/hastane-seti.svg",
            alt: "10 parça hastane çıkışı seti görseli",
            isPrimary: true,
            sortOrder: 1,
          },
        ],
      },
    },
  });

  return {
    organicBabyRomper,
    maternityDress,
    careStarterSet,
    hospitalExitSet,
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
  products: {
    organicBabyRomper: { id: string };
    maternityDress: { id: string };
    careStarterSet: { id: string };
    hospitalExitSet: { id: string };
  };
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

  await prisma.homeSection.create({
    data: {
      type: HomeSectionType.PRODUCT_SHOWCASE,
      eyebrow: "Öne Çıkanlar",
      title: "Vitrine çıkarılan ürünler",
      description:
        "Bu bölüm ana sayfa ürün vitrini için veritabanından seçilen ürünleri göstermektedir.",
      actionLabel: "Tüm Ürünleri Gör",
      actionHref: "/kategori/bebek-giyim",
      sortOrder: 4,
      isActive: true,
      items: {
        create: [
          {
            itemType: HomeSectionItemType.PRODUCT_REFERENCE,
            productId: input.products.organicBabyRomper.id,
            badge: "Öne Çıkan",
            tone: VisualTone.ROSE,
            sortOrder: 1,
            isActive: true,
          },
          {
            itemType: HomeSectionItemType.PRODUCT_REFERENCE,
            productId: input.products.maternityDress.id,
            badge: "Yeni",
            tone: VisualTone.SAGE,
            sortOrder: 2,
            isActive: true,
          },
          {
            itemType: HomeSectionItemType.PRODUCT_REFERENCE,
            productId: input.products.careStarterSet.id,
            badge: "Seçili",
            tone: VisualTone.PEACH,
            sortOrder: 3,
            isActive: true,
          },
          {
            itemType: HomeSectionItemType.PRODUCT_REFERENCE,
            productId: input.products.hospitalExitSet.id,
            badge: "Çok Satan",
            tone: VisualTone.ROSE,
            sortOrder: 4,
            isActive: true,
          },
        ],
      },
    },
  });
}

async function main() {
  console.log("Seed işlemi başlatıldı...");

  await clearSeedData();

  const categories = await seedCategories();
  const products = await seedProducts(categories);

  const slider = await seedHeroSlider();
  const banner = await seedPromoBanner();

  await seedHomeSections({
    sliderId: slider.id,
    bannerId: banner.id,
    products,
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