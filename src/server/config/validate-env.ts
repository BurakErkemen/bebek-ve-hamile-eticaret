/**
 * Açılış-anı (startup) ortam değişkeni doğrulaması.
 *
 * Amaç: eksik/hatalı yapılandırmayı uygulamanın İLK isteğinde değil,
 * modül yüklenirken yakalamak. Böylece prod'da "çalışıyor sandığın ama
 * ilk login denemesinde patlayan" sınıfı hatalar deploy anında görülür.
 *
 * Bu modül `instrumentation.ts` üzerinden Next.js sunucu açılışında çalışır.
 */

type EnvRule = {
  key: string;
  /** Üretimde zorunlu mu? (geliştirmede uyarı, üretimde hata) */
  required: boolean;
  /** Ek doğrulama; hata mesajı döner, geçerliyse null. */
  validate?: (value: string) => string | null;
};

const RULES: EnvRule[] = [
  { key: "DATABASE_URL", required: true },
  {
    key: "ADMIN_SESSION_SECRET",
    required: true,
    validate: (v) =>
      v.length < 32
        ? "en az 32 karakter olmalı (örn: openssl rand -base64 32)"
        : null,
  },
  { key: "ADMIN_USERNAME", required: true },
  {
    key: "ADMIN_PASSWORD",
    required: true,
    validate: (v) =>
      v.length < 8 ? "en az 8 karakter olmalı" : null,
  },
  // PayTR — ödeme akışı için üretimde zorunlu
  { key: "PAYTR_MERCHANT_ID", required: true },
  { key: "PAYTR_MERCHANT_KEY", required: true },
  { key: "PAYTR_MERCHANT_SALT", required: true },
  { key: "NEXT_PUBLIC_APP_URL", required: true },
];

export function validateEnv(): void {
  const isProd = process.env.NODE_ENV === "production";
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const rule of RULES) {
    const value = process.env[rule.key]?.trim();

    if (!value) {
      const msg = `Eksik ortam değişkeni: ${rule.key}`;
      if (rule.required && isProd) errors.push(msg);
      else warnings.push(msg);
      continue;
    }

    const validationError = rule.validate?.(value);
    if (validationError) {
      const msg = `Geçersiz ${rule.key}: ${validationError}`;
      if (rule.required && isProd) errors.push(msg);
      else warnings.push(msg);
    }
  }

  if (warnings.length > 0) {
    console.warn(
      "[env] Uyarılar:\n" + warnings.map((w) => `  - ${w}`).join("\n"),
    );
  }

  if (errors.length > 0) {
    throw new Error(
      "[env] Üretim ortamı yapılandırması eksik/hatalı:\n" +
        errors.map((e) => `  - ${e}`).join("\n"),
    );
  }
}
