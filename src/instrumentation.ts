/**
 * Next.js instrumentation hook'u — sunucu açılışında BİR KEZ çalışır.
 * Ortam değişkenlerini burada doğrulayarak hatalı yapılandırmayı
 * deploy anında (ilk istekte değil) yakalarız.
 */
export async function register() {
  // Yalnızca Node.js runtime'ında çalıştır (Edge'de değil)
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { validateEnv } = await import("@/server/config/validate-env");
    validateEnv();
  }
}
