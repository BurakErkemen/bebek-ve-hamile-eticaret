import Link from "next/link";

export default function StorefrontNotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <p className="text-6xl font-bold text-brand-primary">404</p>
      <h1 className="text-2xl font-semibold text-brand-text">
        Sayfa bulunamadı
      </h1>
      <p className="text-brand-muted">
        Aradığınız sayfa taşınmış veya hiç var olmamış olabilir.
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-primary-dark"
        >
          Ana Sayfaya Dön
        </Link>
        <Link
          href="/arama"
          className="rounded-full border border-brand-border px-6 py-3 text-sm font-semibold text-brand-text transition hover:border-brand-primary"
        >
          Ürün Ara
        </Link>
      </div>
    </div>
  );
}
