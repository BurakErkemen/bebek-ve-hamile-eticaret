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
- `NEXT_PUBLIC_R2_PUBLIC_URL` — (opsiyonel) Cloudflare R2 görsel URL'si; `next/image` hostname whitelist için
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL` — Sipariş e-posta bildirimleri
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` — Şu an kullanılmıyor; altyapı hazır, ileride aktif edilebilir

**Production için ek env değişkenleri** (`docker-compose.prod.yml` okur):
- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` — Postgres container kimlik bilgileri

## Caching

Redis kullanılmıyor. Next.js `unstable_cache` ile sunucu taraflı önbellekleme yapılıyor:

| Cached fonksiyon | Dosya | TTL | Tag |
|-----------------|-------|-----|-----|
| `getCachedHomepageContent` | `application/content/get-homepage-content.cached.ts` | 5 dk | `homepage` |
| `getCachedProductDetail` | `application/catalog/get-product-detail.cached.ts` | 5 dk | `products` |
| `getCachedCategoryCatalog` | `application/catalog/get-category-catalog.cached.ts` | 5 dk | `categories`, `products` |

Cache'i temizlemek için: `revalidateTag("products")` veya `revalidatePath("/urun/[slug]")`.

`src/server/infrastructure/cache/redis.cache.ts` — Redis altyapısı hazır, ileride aktif edilmek üzere bırakıldı.

## Architecture

Next.js App Router projesi, Türkçe route yapısıyla (`/giris` = login, `/sepet` = cart, `/odeme` = checkout).

### Server-Side: Clean Architecture with DDD

```
domain/        → Arayüzler ve entity tipleri (bağımlılık yok)
application/   → Use case'ler; domain arayüzlerine bağımlı
infrastructure/→ Prisma repository gerçeklemeleri; PayTR servisi
presentation/  → Zod validatörler, DTO'lar
```

**Veri akışı:** API route → validator → use case → repository arayüzü → Prisma → PostgreSQL

Use case'ler repository arayüzlerini constructor injection ile alır — use case içinde asla Prisma import edilmez. Concrete repository'ler `src/server/infrastructure/database/repositories/` altında.

### Client-Side: Feature Modules

`src/modules/` altında feature bazlı modüller (cart, product, category, checkout, auth, admin).

- Cart: **Zustand** + `localStorage` persistence (`src/modules/cart/store/cart.store.ts`)
- Path alias: `@/*` → `src/*`

### Prisma & Database

- ORM: Prisma 7, `@prisma/adapter-pg` (PostgreSQL / `pg` driver)
- Generated client: `src/generated/prisma/` (buradan import et, `@prisma/client`'tan değil)
- Schema değişikliği sonrası: `npx prisma generate` → `npx prisma migrate dev`
- **İlk PostgreSQL kurulumu:** `prisma/migrations/` klasörünü sil → `npx prisma migrate dev --name init`

**Ana modeller:**
- `Category` — `parentId` ile hiyerarşik ağaç
- `Product` + `ProductVariant` — ayrı fiyat/stok
- `ProductAttributeValue` — dinamik filtre sistemi (Beden, Renk vb.)
- `HomeSection` / `Slider` / `Banner` — anasayfa CMS içerikleri
- `Order` / `OrderItem` — PayTR entegrasyonlu sipariş akışı

### Route Groups

```
src/app/(admin)/      → /admin/* (dashboard, ürünler, siparişler)
src/app/(auth)/       → /giris, /kayit, /sifremi-unuttum (henüz implemente edilmedi)
src/app/(storefront)/ → Mağaza sayfaları (anasayfa, kategori, ürün, sepet, ödeme)
src/app/api/          → API route handler'ları
```

### PayTR Ödeme Entegrasyonu

1. `POST /api/payment/paytr/initiate` — HMAC-SHA256 token üretir, iframe URL döner
2. `POST /api/payment/paytr/callback` — PayTR webhook; imza doğrular, sipariş durumunu günceller

Config: `src/server/infrastructure/payment/paytr/paytr.config.ts`
IP tespiti: `src/shared/utils/request-ip.ts`

### Infrastructure Services

| Servis | Dosya | Durum |
|--------|-------|-------|
| E-posta | `src/server/infrastructure/mail/resend.service.ts` | Hazır, kullanıma açık |
| Redis cache | `src/server/infrastructure/cache/redis.cache.ts` | Hazır, şimdilik pasif |
| Görseller | `public/uploads/` (VPS volume) | Local ve production aynı yol |

### Design System

Tailwind CSS 4. Veritabanında `VisualTone` enum: `ROSE`, `SAGE`, `PEACH`. Slider slide'ları, banner'lar ve home section item'ları bu ton değerini taşır, renk teması buna göre belirlenir.
