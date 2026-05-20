type ProductDescriptionProps = {
  shortDescription?: string;
  description?: string;
};

export function ProductDescription({
  shortDescription,
  description,
}: ProductDescriptionProps) {
  if (!shortDescription && !description) {
    return null;
  }

  return (
    <section className="rounded-[var(--radius-brand-lg)] border border-brand-border bg-brand-white p-5 md:p-6">
      <h2 className="font-display text-xl font-bold text-brand-text">
        Ürün Açıklaması
      </h2>

      {shortDescription ? (
        <p className="mt-4 text-base font-medium leading-7 text-brand-text">
          {shortDescription}
        </p>
      ) : null}

      {description ? (
        <p className="mt-4 whitespace-pre-line text-sm leading-7 text-brand-muted md:text-base">
          {description}
        </p>
      ) : null}
    </section>
  );
}