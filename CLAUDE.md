# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Veritabanı — Local geliştirme (Docker)
docker compose up -d        # PostgreSQL'i başlat (localhost:5432)
docker compose down         # Durdur (veriler korunur)
docker compose down -v      # Durdur ve tüm veriyi sil

# Development
npm run dev          # Next.js dev server (port 3000)
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint

# Database
npx prisma migrate dev --name <migration-name>   # Yeni migration oluştur ve uygula
npx prisma db seed                               # Örnek veriyi yükle (prisma/seed.ts)
npx prisma studio                                # Görsel DB tarayıcı
npx prisma generate                              # Schema değişikliğinden sonra client'ı yenile

# Production (VPS)
docker compose -f docker-compose.prod.yml up -d --build   # Tüm stack'i başlat
docker compose -f docker-compose.prod.yml down            # Durdur
```

No test runner is configured — there are no test files or testing dependencies in the project.

## Deployment

**Local:** `docker-compose.yml` — sadece PostgreSQL container, Next.js `npm run dev` ile çalışır.

**Production (Hostinger VPS):** `docker-compose.prod.yml` — 3 servis:
- `postgres` — PostgreSQL 17 (volume ile kalıcı veri)
- `app` — Next.js standalone build (Dockerfile ile)
- `nginx` — Reverse proxy (port 80/443); SSL için `nginx.conf` içindeki yorum satırları açılır

Görsel dosyalar (`public/uploads/`) Docker volume ile kalıcı tutulur — container yeniden başlatılınca kaybolmaz.

## Environment Variables

`.env.example`'ı kopyala, `.env` olarak kaydet:

- `DATABASE_URL` — Local: `postgresql://bebek:bebek123@localhost:5432/bebek_eticaret_db` / Production: postgres container'a bağlanır
- `PAYTR_MERCHANT_ID`, `PAYTR_MERCHANT_KEY`, `PAYTR_MERCHANT_SALT` — PayTR ödeme sistemi
- `NEXT_PUBLIC_APP_URL` — PayTR callback URL'si için zorunlu
- `PAYTR_TEST_MODE=1` — PayTR sandbox modu
- `PAYTR_DEBUG=1` — PayTR istek detaylarını logla (sadece geliştirmede kullan)
- `NEXT_PUBLIC_R2_PUBLIC_URL` — (opsiyonel) Cloudflare R2 görsel URL'si; `next/image` hostname whitelist için
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL` — Sipariş e-posta bildirimleri (müşteri onay maili)
- `ADMIN_NOTIFICATION_EMAIL` — Yeni sipariş admin bildirimi için (opsiyonel)
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` — Rate limiting için aktif; yoksa rate-limit atlanır

**Production için ek env değişkenleri** (`docker-compose.prod.yml` okur):
- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` — Postgres container kimlik bilgileri

## Caching

Next.js `unstable_cache` ile sunucu taraflı önbellekleme. Sayfalar doğrudan cached fonksiyonları çağırır:

| Cached fonksiyon | Dosya | TTL | Tag |
|-----------------|-------|-----|-----|
| `getCachedHomepageContent` | `application/content/get-homepage-content.cached.ts` | 5 dk | `homepage` |
| `getCachedProductDetail` | `application/catalog/get-product-detail.cached.ts` | 5 dk | `products` |
| `getCachedCategoryCatalog` | `application/catalog/get-category-catalog.cached.ts` | 5 dk | `categories`, `products` |

Admin ürün/kategori mutasyonları `revalidateTag("products", "client")` / `revalidateTag("categories", "client")` çağırır.

`src/server/infrastructure/cache/redis.cache.ts` — `getCache/setCache/deleteCache` yardımcıları mevcut ama şu an kullanılmıyor.

## Rate Limiting

`src/server/infrastructure/rate-limit/rate-limiter.ts` — Upstash Redis tabanlı sliding-window limiter.

Korunan uçlar ve limitler:
| Uç | Prefix | Pencere | Limit |
|----|--------|---------|-------|
| `POST /api/auth/login` | `auth:login` | 60s | 10 istek |
| `POST /api/auth/register` | `auth:register` | 3600s | 5 istek |
| `POST /api/checkout` | `checkout` | 60s | 5 istek |
| `POST /api/order-lookup` | `order:lookup` | 60s | 20 istek |
| `POST /api/payment/paytr/initiate` | `paytr:initiate` | 60s | 5 istek |

`UPSTASH_REDIS_REST_URL` / `TOKEN` tanımlı değilse limiter sessizce atlanır (geliştirme ortamı güvenli).

## Architecture

Next.js App Router projesi, Türkçe route yapısıyla (`/giris` = login, `/sepet` = cart, `/odeme` = checkout).

### Server-Side: Clean Architecture with DDD

```
domain/        → Arayüzler ve entity tipleri (bağımlılık yok)
application/   → Use case'ler; domain arayüzlerine bağımlı
infrastructure/→ Prisma repository gerçeklemeleri; PayTR servisi; rate-limit; mail
presentation/  → Zod validatörler, DTO'lar; handleApiError yardımcısı
```

**Veri akışı:** API route → validator → use case → repository arayüzü → Prisma → PostgreSQL

Use case'ler repository arayüzlerini constructor injection ile alır — use case içinde asla Prisma import edilmez.

### Client-Side: Feature Modules

`src/modules/` altında feature bazlı modüller (cart, product, category, checkout, auth, admin, search, home).

- Cart: **Zustand** + `localStorage` persistence (`src/modules/cart/store/cart.store.ts`)
- Path alias: `@/*` → `src/*`

### Prisma & Database

- ORM: Prisma 7, `@prisma/adapter-pg` (PostgreSQL / `pg` driver)
- Generated client: `src/generated/prisma/` (buradan import et, `@prisma/client`'tan değil)
- Singleton: `globalThis` üzerinde her ortamda paylaşılır (soğuk başlatma bağlantı açığını önler)
- Schema değişikliği sonrası: `npx prisma generate` → `npx prisma migrate dev`

**Ana modeller:**
- `Category` — `parentId` ile hiyerarşik ağaç
- `Product` + `ProductVariant` — ayrı fiyat/stok; varyant güncellemesi sku üzerinden upsert (ID korunur)
- `ProductAttributeValue` — dinamik filtre sistemi (Beden, Renk vb.)
- `HomeSection` / `Slider` / `Banner` — anasayfa CMS içerikleri
- `Order` / `OrderItem` — PayTR entegrasyonlu sipariş akışı
- `Page` — KVKK, mesafeli satış, iade vb. yasal sayfalar (slug'a göre `/sayfa/[slug]`)
- `User` — Müşteri hesapları (giriş/kayıt aktif; şifre sıfırlama henüz yok)

### Route Groups

```
src/app/(admin)/      → /admin/* (dashboard, ürünler, siparişler, CMS)
src/app/(storefront)/ → Mağaza sayfaları (anasayfa, kategori, ürün, sepet, ödeme, hesap)
src/app/api/          → API route handler'ları
```

Not: `/giris`, `/kayit` route'ları `(storefront)` grubundadır; müşteri auth aktiftir.

### Müşteri Auth

JWT tabanlı cookie session (`CUSTOMER_SESSION_COOKIE`). `src/server/infrastructure/auth/customer-session.ts`.
Giriş, kayıt ve `GET /api/auth/me` uçları aktiftir. Şifre sıfırlama henüz implement edilmemiştir.

### PayTR Ödeme Entegrasyonu

1. `POST /api/payment/paytr/initiate` — HMAC-SHA256 token üretir, iframe URL döner
2. `POST /api/payment/paytr/callback` — PayTR webhook; imza doğrular, sipariş durumunu günceller,
   sipariş onay e-postasını tetikler (`ResendOrderConfirmationMailer`)

Config: `src/server/infrastructure/payment/paytr/paytr.config.ts`

### Para Birimi Biçimlendirme

Tüm fiyat gösterimleri `formatTRY()` kullanır: `src/shared/utils/format-currency.ts`.
Hardcoded `Intl.NumberFormat` kullanımı yoktur.

### Infrastructure Services

| Servis | Dosya | Durum |
|--------|-------|-------|
| E-posta (müşteri) | `src/server/infrastructure/mail/resend.service.ts` | Aktif — sipariş onayı gönderilir |
| E-posta (admin bildirim) | `src/server/infrastructure/mail/resend.service.ts` | Aktif — `ADMIN_NOTIFICATION_EMAIL` gerekli |
| Rate limiting | `src/server/infrastructure/rate-limit/rate-limiter.ts` | Aktif — Upstash Redis |
| Redis (genel) | `src/server/infrastructure/cache/redis.cache.ts` | Hazır, şimdilik pasif |
| Görseller | `public/uploads/` (VPS volume) | Local ve production aynı yol |

### Design System

Tailwind CSS 4. Token'lar `src/app/globals.css`'de CSS custom property olarak tanımlıdır.
Palet: sıcak fildişi zemin (`--surface: #FBF8F3`), charcoal metin (`--ink`), tozlu gül (`--blush`),
adaçayı (`--sage`), amber CTA (`--amber: #C8722A`).
Font: Fraunces (display/serif, variable) + Inter (sans).
Animasyon: Lenis smooth scroll + GSAP ScrollTrigger (parallax, scroll-reveal).

Veritabanında `VisualTone` enum: `ROSE`, `SAGE`, `PEACH`. Slider/banner/section tone renkleri buna göre belirlenir.

### Yasal Uyum (KVKK)

- Çerez onayı: `src/components/layout/cookie-banner.tsx` (localStorage tabanlı, storefront layout'ta)
- Checkout: mesafeli satış + KVKK onay kutusu zorunludur (`contractAccepted` state)
- Yasal sayfalar: `Page` modeli ile CMS'den yönetilir. İçerik admin panelden girilmeli:
  - `/sayfa/mesafeli-satis-sozlesmesi`
  - `/sayfa/gizlilik-politikasi`
  - `/sayfa/iade-ve-degisim`
