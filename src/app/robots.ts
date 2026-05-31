import type { MetadataRoute } from "next";

const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://bebekvehamile.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api", "/hesap", "/odeme", "/sepet"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
