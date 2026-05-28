# Proje Durum Raporu & Görev Listesi

> Bebek & Hamile E-Ticaret — Durum değerlendirmesi ve yapılacaklar
> Son güncelleme: 2026-05-28

## Genel Durum

Proje sağlam bir temele sahip: Clean Architecture / DDD ile düzenli sunucu katmanı,
varyantlı ürün kataloğu, dinamik filtre sistemi, hiyerarşik kategoriler, tam yönetilebilir
anasayfa CMS'i (slider/banner/blok), blog, statik sayfalar ve **uçtan uca PayTR ödeme akışı**
(HMAC token, hash doğrulama, idempotent callback, sunucu taraflı fiyat çözümleme, stok düşürme).

Ancak **canlıya çıkış için engelleyici eksikler** var — en başta admin panelinde hiç kimlik
doğrulama olmaması ve ödeme sonrası dönüş sayfalarının bulunmaması. Aşağıdaki liste önceliğe
göre sıralanmıştır.

---

## 🔴 KRİTİK — Canlıya çıkışı engelleyen / güvenlik açığı

- [x] **Admin kimlik doğrulaması eklendi.** Env tabanlı tek admin girişi (`ADMIN_USERNAME`,
  `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`), imzalı HttpOnly cookie (`src/server/infrastructure/auth/session.ts`),
  `src/proxy.ts` ile `/admin` + `/api/admin` koruması, `/admin/giris` giriş sayfası, sidebar'da çıkış butonu.
  Runtime doğrulandı: cookie'siz admin API → 401, geçerli giriş → erişim açık.
- [x] **`/api/upload` korundu.** Proxy matcher'ına eklendi; cookie'siz istek 401 döner.
- [x] **Ödeme dönüş sayfaları eklendi.** `/odeme/basarili` ve `/odeme/basarisiz` — `merchant_oid`
  ile siparişi bulup özet/durum gösteriyor (artık 404 yok). Bonus: `.env.example` placeholder'a çevrildi,
  `.gitignore`'a `!.env.example` eklendi (secret'lar git geçmişinde değildi; yine de Resend/Upstash anahtarlarını rotate etmen önerilir).

---

## 🟠 YÜKSEK ÖNCELİK — Bu tip e-ticaret için beklenen temel özellikler

- [x] **Ürün arama eklendi.** Header'da arama çubuğu (masaüstü + mobil) ve `/arama` sonuç sayfası
  (isim/kısa açıklama/açıklama/SKU üzerinden, büyük-küçük harf duyarsız).
- [x] **Misafir sipariş takibi eklendi.** `/siparis-takibi` sayfası (sipariş no + e-posta ile),
  `/api/order-lookup` uç noktası, footer linki bağlandı.
- [x] **Kargo ücreti hesaplama eklendi.** `SHIPPING_FEE` + `FREE_SHIPPING_THRESHOLD` ayarları (admin
  panelinden yönetilir), checkout'ta sunucu taraflı hesaplama + UI'da kargo satırı/eşik mesajı,
  duyuru çubuğu eşiği yansıtıyor.
- [x] **Stok rezervasyonu / aşırı satış koruması eklendi.** Stok ödeme başlatılırken (initiate)
  atomik `updateMany` ile rezerve edilir; başarıda yalnızca kesinleşir, başarısızlıkta geri bırakılır,
  60 dk geçen terk edilmiş rezervasyonlar otomatik iptal + iade edilir. "Ödedi ama stok yok" durumu giderildi.
- [x] **Müşteri hesapları (temel) eklendi.** `User` modeli + migration, scrypt parola hash, imzalı
  cookie oturumu, `/kayit` · `/giris` · `/hesap` sayfaları, header'da koşullu Giriş/Hesabım,
  siparişlerin kullanıcıya bağlanması + sipariş geçmişi, checkout formunun ön doldurulması.
  Runtime doğrulandı (kayıt/giriş/çıkış/koruma). **Kapsam dışı (sonraya):** kayıtlı adresler, şifre sıfırlama.

---

## 🟡 ORTA ÖNCELİK — SEO, dönüşüm, yasal uyum

### SEO & Pazarlama
- [ ] **`sitemap.ts` ve `robots.ts`** ekle (Next.js App Router native). Ürün/kategori/blog URL'leri dahil.
- [ ] **Yapılandırılmış veri (JSON-LD):** Product, BreadcrumbList, Organization şemaları.
- [ ] **Open Graph / Twitter card** meta etiketleri (ürün ve kategori sayfaları için).
- [ ] **Analitik:** GA4 ve/veya Meta Pixel (e-ticaret olayları: view_item, add_to_cart, purchase).

### Yasal (Türkiye e-ticaret mevzuatı — zorunlu)
- [ ] **Mesafeli satış sözleşmesi, gizlilik politikası, iade/iptal koşulları, KVKK aydınlatma metni.**
  `Page` CMS modeli mevcut — içerikleri gir ve footer/checkout'a bağla.
- [ ] **Checkout'ta sözleşme onayı** (ön bilgilendirme + mesafeli satış onay kutusu).
- [ ] **Çerez onayı (KVKK/cookie consent)** banner'ı.

### Dönüşüm / UX
- [ ] **Benzer / önerilen ürünler** ürün sayfasında.
- [ ] **Stokta yok / son X adet** rozetleri (liste ve ürün sayfasında).
- [ ] **Favoriler / istek listesi** (opsiyonel).
- [ ] **Ürün yorumları & puanlama** (opsiyonel ama dönüşümü artırır).

---

## 🟢 DÜŞÜK ÖNCELİK — Teknik kalite & operasyon

- [ ] **Rate limiting** — checkout, payment/initiate ve upload endpoint'lerine. (Upstash Redis zaten
  yapılandırılmış, sadece pasif — burada aktif edilebilir.)
- [ ] **Hata izleme** — Sentry veya benzeri (özellikle ödeme akışı için).
- [ ] **Test altyapısı** — şu an hiç test yok. En azından kritik akışlar (checkout, callback,
  fiyat hesaplama) için birim/entegrasyon testleri.
- [ ] **Env doğrulama** — başlangıçta tüm zorunlu env'leri doğrula (şu an sadece PayTR doğrulanıyor).
- [ ] **PayTR debug loglarını üretimde kapat** — `paytr-iframe.service.ts:121` `console.info` ile
  ödeme detaylarını logluyor; env ile koşullandır.
- [ ] **Fatura / e-arşiv** entegrasyonu (sipariş sonrası).
- [ ] **Redis cache'i aktifleştir** (opsiyonel) — çok-instance dağıtımda `unstable_cache` paylaşılmaz.
- [ ] **Erişilebilirlik (a11y) ve mobil** denetimi — gerçek cihaz/tarayıcı testi.
- [ ] **Admin: sipariş durumu/kargo takip no** alanı ve müşteriye kargo bildirimi.

---

## Not: Doğru çalışan ve sağlam olan kısımlar

- PayTR akışı: HMAC token üretimi, callback hash doğrulama, **idempotent** finalize, sunucu
  taraflı fiyat çözümleme (client fiyatına güvenilmiyor), transaction içinde stok düşürme. ✅
- Clean Architecture katmanlaması (use case'ler repository arayüzü üzerinden çalışıyor). ✅
- Anasayfa CMS (slider/banner/blok), kategori ağacı, dinamik attribute filtreleri. ✅
- `unstable_cache` ile sunucu taraflı önbellekleme (homepage/product/category). ✅
- Resend e-posta altyapısı hazır. ✅
