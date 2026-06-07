import type { NextConfig } from "next";

const r2PublicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? "";
const r2Hostname = r2PublicUrl ? new URL(r2PublicUrl).hostname : "";

/**
 * Tüm yanıtlara uygulanan HTTP güvenlik başlıkları.
 * - X-Frame-Options: clickjacking koruması (PayTR iframe BİZİM sayfamızı
 *   sarmaz; biz onu sararız, dolayısıyla SAMEORIGIN güvenli).
 * - nosniff: MIME-sniffing tabanlı XSS önlemi.
 * - HSTS: yalnızca HTTPS zorlar (SSL aktif edildikten sonra etkili olur).
 * - Permissions-Policy: kullanılmayan tarayıcı API'lerini kapatır.
 */
const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false, // "X-Powered-By: Next.js" başlığını gizle
  images: {
    remotePatterns: r2Hostname
      ? [{ protocol: "https", hostname: r2Hostname }]
      : [],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
