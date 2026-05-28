# Derinlemesine Proje İnceleme Raporu

> Bebek & Hamile E-Ticaret — kod kalitesi, logic, tasarım/UX ve MVP eksiklikleri
> Tarih: 2026-05-28 · Tüm bulgular dosya:satır referanslıdır.

## Özet (Verdict)

Mimari sağlam (Clean Architecture/DDD, varyantlı katalog, dinamik filtreler, PayTR akışı,
admin CMS). Bu oturumda **auth, ödeme dönüş sayfaları, arama, sipariş takibi, kargo, stok
rezervasyonu ve temel müşteri hesapları** eklendi. Ancak hâlâ bir MVP e-ticaret sitesinin
beklediği birkaç **fonksiyonel eksik** ve birkaç **logic/kalite borcu** var. En kritik üçü:
**(1)** sipariş onay e-postası hiç gönderilmiyor, **(2)** ürün güncelleme varyant ID'lerini
bozuyor, **(3)** dökümante edilen önbellek katmanı tamamen kullanılmıyor.

---

## 1. MVP E-Ticaret Kontrol Listesi

| Gereksinim | Durum | Not |
|-----------|:----:|-----|
| Ürün listeleme / kategori | ✅ | `kategori/[slug]` |
| Ürün detay + varyant | ✅ | `urun/[slug]` |
| Arama | ✅ | `/arama` (bu oturumda eklendi) |
| Sepet | ✅ | Zustand + localStorage |
| Checkout + ödeme | ✅ | PayTR |
| Ödeme dönüş sayfaları | ✅ | `/odeme/basarili`·`basarisiz` (eklendi) |
| Stok yönetimi / rezervasyon | ✅ | initiate'te atomik rezerve (eklendi) |
| Kargo ücreti | ✅ | SiteSetting tabanlı (eklendi) |
| Sipariş takibi | ✅ | `/siparis-takibi` (eklendi) |
| Müşteri hesabı + sipariş geçmişi | ✅ | temel sürüm (eklendi) |
| Admin paneli + auth | ✅ | proxy koruması (eklendi) |
| **Sipariş onay e-postası** | ❌ | Servis var, **çağrılmıyor** (bkz. 2.1) |
| **Yasal sayfalar (KVKK/mesafeli satış/iade)** | ⚠️ | `Page` CMS var ama içerik/bağlantı yok (bkz. 7) |
| **Çerez onayı (KVKK)** | ❌ | Yok |
| **SEO (sitemap/robots/JSON-LD)** | ❌ | Yok (bkz. 6) |
| **Şifre sıfırlama** | ❌ | Kapsam dışı bırakıldı |
| **Rate limiting** | ❌ | Hiçbir uçta yok (bkz. 5) |

---

## 2. Kritik / Logic Hataları

### 2.1 🔴 Sipariş onay e-postası hiç gönderilmiyor
`sendOrderConfirmationEmail` tanımlı (`src/server/infrastructure/mail/resend.service.ts:13`)
ama projede **hiçbir yerden çağrılmıyor** (grep: yalnızca kendi dosyasında geçiyor). PayTR
callback başarıda siparişi kesinleştiriyor (`prisma-paytr-callback.repository.ts:67-78`) fakat
e-posta tetiklenmiyor. Müşteri ödeme sonrası hiçbir onay maili almıyor — MVP için temel eksik.
**Öneri:** callback'in `success` dalında (idempotent guard'ın içinde) `sendOrderConfirmationEmail`
çağrısı; ayrıca admin'e yeni sipariş bildirimi.

### 2.2 🔴 `updateProduct` her düzenlemede varyantları silip yeniden yaratıyor
`prisma-product-admin.repository.ts:99-121` — güncellemede tüm `ProductImage` ve `ProductVariant`
kayıtları `deleteMany` ile silinip yeniden `create` ediliyor. Sonuç: **varyant ID'leri her
düzenlemede değişir.** Bunun zincirleme etkileri:
- `OrderItem.variantId` ilişkisi `onDelete: SetNull` (`prisma/schema.prisma:219`) → geçmiş
  siparişlerin varyant bağı kopar.
- Müşterinin `localStorage`'daki sepeti eski `variantId`'yi tutar → checkout'ta
  "Sepetteki ürünlerden biri artık satışta değil" hatası (`prisma-checkout-order.repository.ts:98-103`).
- Devam eden stok rezervasyonları varyant ID'sine dayanır → tutarsızlık.
**Öneri:** Varyantları `id`/`sku` üzerinden upsert et; silinmeyenleri koru.

### 2.3 🔴 Dökümante edilen `unstable_cache` katmanı tamamen kullanılmıyor (ölü kod)
`getCachedHomepageContent`, `getCachedProductDetail`, `getCachedCategoryCatalog`
(`get-homepage-content.cached.ts:5`, `get-product-detail.cached.ts:5`,
`get-category-catalog.cached.ts:6`) tanımlı ama **hiçbir sayfa import etmiyor.** Sayfalar use
case'leri doğrudan çağırıyor:
- Anasayfa: `src/app/(storefront)/page.tsx:9-12`
- Ürün: `src/app/(storefront)/urun/[slug]/page.tsx:21-24`
- Kategori: `src/app/(storefront)/kategori/[slug]/page.tsx:115-120`

Üstelik ürün admin route'ları (`/api/admin/products*`) hiç `revalidateTag("products")`
çağırmıyor (grep'te yok). Yani CLAUDE.md'de (satır 60-68) "aktif" diye anlatılan önbellek+tag
invalidasyonu gerçekte yok. **Sonuç:** kod ile dokümantasyon çelişiyor + dinamik sayfalar her
istekte DB'ye gidiyor (kaçırılmış optimizasyon). **Öneri:** ya cached fonksiyonları sayfalara
bağla + admin mutasyonlarında `revalidateTag` çağır, ya da ölü dosyaları ve yanlış dokümantasyonu sil.

### 2.4 🟠 Admin CRUD uçlarında hata yönetimi yok → kullanıcıya çıplak 500
`src/app/api/admin/products/route.ts:47-61` (POST) ve `.../products/[id]/route.ts:52-74`
(PUT/DELETE) try/catch içermiyor. Aynı `slug` veya `sku` ile ürün eklenince Prisma `P2002`
fırlatır → yakalanmadığı için **500** döner (anlamlı "bu slug zaten var" mesajı yerine). Checkout
route'u (`api/checkout/route.ts:51-73`) doğru şekilde try/catch + tipli hata kullanıyor; admin
uçları bu standardı izlemiyor — **tutarsızlık.** **Öneri:** Prisma `P2002`/FK hatalarını yakalayıp
409/400 ile anlamlı mesaj döndüren ortak bir hata sarmalayıcı.

### 2.5 🟠 "Hızlı Ödeme" butonu işlevsiz
`src/modules/product/components/product-purchase-panel.tsx:217-223` — buton render ediliyor,
stok durumuna göre disable oluyor ama **`onClick` yok.** Kullanıcı tıklayınca hiçbir şey olmuyor.
Ya işlevsel hale getirilmeli (sepete ekle + `/odeme`'ye git) ya da kaldırılmalı.

### 2.6 🟡 404 sayfası header/footer'sız
`src/app/not-found.tsx` kök seviyede; storefront layout'unun **dışında** render olur → header,
arama, footer ve navigasyon yok. Kullanıcı 404'te yalnızca "Ana Sayfaya Dön" görür. **Öneri:**
storefront grubuna bir `not-found.tsx` ekle ya da kökü layout'a sar.

### 2.7 🟡 `loading.tsx` / `error.tsx` yok
Hiçbir route segmentinde error boundary veya loading state yok (yalnızca global `not-found.tsx`).
Dinamik DB sayfalarında (`urun`, `kategori`, `arama`, `hesap`) bir DB hatası **ham Next hata
sayfası** gösterir; sayfa geçişlerinde iskelet/spinner yok. **Öneri:** En az storefront kökünde
`error.tsx` + ağır sayfalarda `loading.tsx`.

---

## 3. Kod Standartları / Kalite

### 3.1 `currencyFormatter` her dosyada yeniden tanımlanıyor
Aynı `Intl.NumberFormat("tr-TR", { currency: "TRY" })` bloğu en az şu dosyalarda kopyalanmış:
`product-card.tsx:15`, `checkout-page-content.tsx:53`, `product-purchase-panel.tsx:32`,
`order-summary-card.tsx:6`, `cart-page-content.tsx:11`, `announcement-bar.tsx`. **Öneri:**
`src/shared/utils/format-currency.ts` altında tek bir `formatTRY()` (bazı yerlerde
`maximumFractionDigits: 0`, bazılarında değil — bu da tutarsız).

### 3.2 `ProductVariant` tipi 3 yerde tekrar tanımlı
`product-purchase-panel.tsx:6-16`, `product-card.types.ts:1-11`, `category-catalog.entity.ts:1-11`
neredeyse birebir aynı. Tek bir paylaşılan tip kullanılmalı.

### 3.3 Prisma enum → string union için tekrarlı `as` cast
`prisma-order-admin.repository.ts:26,49-50` ve `prisma-order-lookup.repository.ts` içinde
`o.status as OrderAdminStatus` gibi cast'ler dağınık. Tek bir map/dönüştürücü yardımcıya alınabilir.

### 3.4 Prisma client production'da global cache'lenmiyor
`src/server/infrastructure/database/prisma/prisma-client.ts:18-20` — singleton yalnızca
`NODE_ENV !== "production"` iken `globalThis`'e yazılıyor. Serverless (Vercel) ortamında her
soğuk başlatma yeni `PrismaPg`/`pg.Pool` açar; **pooled bağlantı** (pgBouncer/Neon pooler)
kullanılmazsa bağlantı tükenmesi riski. Deploy öncesi dikkat.

### 3.5 Üretimde gürültülü/loglar
`paytr-iframe.service.ts:121` ödeme detaylarını `console.info` ile logluyor;
`initiate route.ts:59` ve `checkout route.ts:63` `console.error`. PayTR debug logu env ile
koşullandırılmalı (hassas veri + gürültü).

### 3.6 Env doğrulaması kısmi
Yalnızca PayTR env'leri doğrulanıyor (`paytr.config.ts:14-35`). `DATABASE_URL`,
`ADMIN_SESSION_SECRET`, `RESEND_*` başlangıçta doğrulanmıyor → eksik env'de çalışma anında
beklenmedik hata. **Öneri:** açılışta tek bir env şeması (zod) ile doğrulama.

### 3.7 Kullanılmayan altyapı
`src/server/infrastructure/cache/redis.cache.ts` ve `@upstash/redis` bağımlılığı tamamen pasif.
Ya rate-limit/önbellek için kullanılmalı ya da bağımlılık kaldırılmalı.

### 3.8 CLAUDE.md güncel değil
Caching tablosu (satır 60-68) gerçeği yansıtmıyor (bkz. 2.3); ayrıca `(auth)` "henüz implemente
edilmedi" yazıyor ama artık müşteri auth var. Dokümantasyon koddan sapmış.

---

## 4. Tasarım / UX

### 4.1 Sepet sayfasında kargo hâlâ "Sonraki adımda"
`cart-page-content.tsx:164-169` ve toplam = ara toplam (`:177-179`). Kargo artık hesaplanıyor
(checkout'ta gösteriliyor) ama sepet sayfası eski metni gösteriyor — tutarsız. Ücretsiz kargo
eşiğine kalan tutarı sepet sayfasında da göstermek dönüşümü artırır.

### 4.2 Sepet fiyatı bayatlayabilir
`unitPrice` sepete eklenme anında `localStorage`'a yazılır (`cart.store.ts`). Fiyat değişirse
kullanıcıya eski fiyat gösterilir; checkout sunucuda gerçek fiyatı çözer
(`prisma-checkout-order.repository.ts:126-128`) — doğru ama kullanıcı **gösterilen ile çekilen
tutar farkı** görüp kafası karışabilir. Stok kapasitesi de eklenme anındaki snapshot'tan gelir
(`cart.store.ts:49-52,97-100`), stok düşerse bayat olur.

### 4.3 Varyant seçimi tek liste (beden+renk ayrışık değil)
`product-purchase-panel.tsx:153-204` tüm varyantları tek kart listesi olarak gösteriyor. Beden ve
renk ayrı eksende seçilemiyor; çok varyantlı üründe UX zayıf. Ayrıca seçilince
`feedbackMessage` ("Ürün sepete eklendi") **hiç temizlenmiyor** (`:107`) — kalıcı kalır.

### 4.4 Liste/kartlarda stok rozeti yok
"Stokta/Tükendi" rozeti yalnızca ürün detayda (`product-purchase-panel.tsx:120-128`). Kategori/
arama kartlarında (`product-card.tsx`) stok durumu görünmüyor; kullanıcı tıklayana kadar tükendiğini
anlamıyor.

### 4.5 Form validasyon geri bildirimi sınırlı
Checkout telefon doğrulaması yalnızca `min(10)` (`checkout.validator.ts:8`) — format yok. Auth
formlarında alan bazlı hata gösterimi yok; tek genel mesaj. Inline validasyon UX'i artırır.

### 4.6 Arama temel
`/arama` yalnızca submit ile çalışıyor; canlı öneri/autocomplete, sayfalama veya "sonuç yok"
önerisi yok (`search-bar.tsx`, `arama/page.tsx`). Sonuçlar 48 ile sınırlı, sayfalama yok.

---

## 5. Güvenlik / Operasyon

- **Rate limiting yok:** `/api/auth/login`, `/api/auth/register`, `/api/order-lookup`,
  `/api/checkout`, `/api/payment/paytr/initiate`, `/api/upload` hiçbiri sınırlandırılmıyor →
  brute-force ve kötüye kullanım açık. Upstash zaten kurulu, burada kullanılabilir.
- **Admin/müşteri girişinde** deneme sınırı / gecikme yok — sözlük saldırısına açık.
- **`order-lookup`** sipariş no + e-posta ile sorgulanıyor (iyi) ama rate-limit olmadan
  numara/e-posta denemesiyle bilgi sızdırma teorik olarak mümkün.

---

## 6. SEO / Pazarlama (önceki rapordan devam)

- `sitemap.ts`, `robots.ts` yok.
- JSON-LD (Product, BreadcrumbList, Organization) yok.
- Open Graph / Twitter card meta yok (yalnızca title/description — `layout.tsx:18-25` ve
  sayfa `generateMetadata`'ları).
- Analitik (GA4 / Meta Pixel) yok.

---

## 7. Türkiye Yasal Uyum (MVP için zorunlu)

- Mesafeli satış sözleşmesi, gizlilik/KVKK aydınlatma, iade/iptal koşulları, ön bilgilendirme —
  `Page` CMS modeli var ama içerik girilmemiş ve checkout'ta **sözleşme onay kutusu yok.**
- Footer'daki "İade ve Değişim" / "Sık Sorulan Sorular" linkleri hâlâ `#`
  (`components/layout/footer.tsx:128-129`).
- Çerez onayı banner'ı yok.

---

## Öncelikli Aksiyon Listesi

1. 🔴 Sipariş onay e-postasını PayTR callback başarı dalına bağla (2.1).
2. 🔴 `updateProduct`'ı varyant upsert'e çevir; ID korunmasını sağla (2.2).
3. 🔴 Önbellek katmanını ya bağla+revalidate, ya da kaldır + CLAUDE.md'yi düzelt (2.3, 3.8).
4. 🟠 Admin CRUD uçlarına ortak hata yönetimi (P2002 → 409) (2.4).
5. 🟠 "Hızlı Ödeme" butonunu işlevsel yap veya kaldır (2.5).
6. 🟠 Yasal sayfa içerikleri + checkout sözleşme onayı + çerez banner'ı (7).
7. 🟡 `error.tsx`/`loading.tsx`, storefront 404, rate limiting, SEO (sitemap/robots/JSON-LD).
8. 🟡 `currencyFormatter` ve `ProductVariant` tekilleştirme, env doğrulama, log temizliği.
