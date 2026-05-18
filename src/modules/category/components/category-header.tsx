type CategoryHeaderProps = {
  name: string;
  description?: string;
  productCount: number;
};

export function CategoryHeader({
  name,
  description,
  productCount,
}: CategoryHeaderProps) {
  return (
    <section className="mt-6 rounded-[var(--radius-brand-xl)] border border-brand-border bg-brand-white p-6 md:p-8">
      <p className="font-display text-sm font-bold uppercase tracking-[0.18em] text-brand-primary-dark">
        Kategori
      </p>

      <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-brand-text md:text-4xl">
            {name}
          </h1>

          {description ? (
            <p className="mt-4 max-w-3xl text-sm leading-7 text-brand-muted md:text-base">
              {description}
            </p>
          ) : null}
        </div>

        <div className="inline-flex w-fit rounded-full bg-brand-secondary px-4 py-2 text-sm font-semibold text-brand-text">
          {productCount} ürün
        </div>
      </div>
    </section>
  );
}