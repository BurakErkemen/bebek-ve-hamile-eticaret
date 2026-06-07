import type { MetadataRoute } from "next";
import { prisma } from "@/server/infrastructure/database/prisma/prisma-client";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://bebekvehamile.com";

// İstek anında üret — build sırasında DB'ye bağlanmayı deneme.
// (Build ortamında DB yok; prerender hatası bu sayede önlenir.)
export const dynamic = "force-dynamic";
export const revalidate = 3600; // 1 saat CDN/ISR önbelleği

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/arama",
    "/siparis-takibi",
    "/blog",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: path === "" ? 1 : 0.6,
  }));

  try {
    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.category.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
      url: `${baseUrl}/urun/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
      url: `${baseUrl}/kategori/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    return [...staticRoutes, ...productRoutes, ...categoryRoutes];
  } catch (error) {
    // DB erişilemezse en azından statik rotaları döndür (sitemap boş kalmasın)
    console.error("[sitemap] DB hatası, yalnızca statik rotalar döndürülüyor:", error);
    return staticRoutes;
  }
}
