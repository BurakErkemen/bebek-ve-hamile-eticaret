export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col px-4 py-10 md:px-6 lg:px-8">
      <section className="rounded-[var(--radius-brand-lg)] border border-brand-border bg-brand-white p-6 shadow-sm md:p-10">
        <p className="mb-3 font-display text-sm font-semibold uppercase tracking-[0.2em] text-brand-primary-dark">
          Bebek & Hamile E-Ticaret
        </p>

        <h1 className="max-w-3xl font-display text-3xl font-bold tracking-tight text-brand-text md:text-5xl">
          Mağaza kabuğu hazır: header, navigasyon ve footer başarıyla kuruldu.
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-7 text-brand-muted md:text-lg">
          Bir sonraki adımda ana sayfa için dinamik hero slider alanını,
          kategori vitrinlerini ve veri modeline bağlanabilecek section
          mimarisini kuracağız.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button className="rounded-full bg-brand-primary px-6 py-3 font-semibold text-white transition hover:bg-brand-primary-dark">
            Alışverişe Başla
          </button>

          <button className="rounded-full border border-brand-border bg-brand-secondary px-6 py-3 font-semibold text-brand-text transition hover:opacity-90">
            Kategorileri İncele
          </button>
        </div>
      </section>
    </main>
  );
}