import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-3xl items-center justify-center px-4 py-16">
      <section className="w-full rounded-[var(--radius-brand-xl)] border border-brand-border bg-brand-white p-8 text-center md:p-12">
        <p className="font-display text-sm font-bold uppercase tracking-[0.18em] text-brand-primary-dark">
          404
        </p>

        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-brand-text md:text-4xl">
          Aradığınız sayfa bulunamadı.
        </h1>

        <p className="mt-4 text-sm leading-7 text-brand-muted md:text-base">
          Bağlantı kaldırılmış, değiştirilmiş veya yanlış yazılmış olabilir.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-brand-primary px-6 py-3 font-semibold text-white transition hover:bg-brand-primary-dark"
        >
          Ana Sayfaya Dön
        </Link>
      </section>
    </main>
  );
}