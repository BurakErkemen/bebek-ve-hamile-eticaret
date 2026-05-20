type ProductAttributeValue = {
  id: string;
  value: string;
  slug: string;
  colorHex?: string;
};

type ProductAttributeGroup = {
  id: string;
  name: string;
  slug: string;
  displayType: "CHECKBOX" | "RADIO" | "COLOR_SWATCH" | "BADGE";
  values: ProductAttributeValue[];
};

type ProductAttributeListProps = {
  attributes: ProductAttributeGroup[];
};

export function ProductAttributeList({
  attributes,
}: ProductAttributeListProps) {
  if (attributes.length === 0) {
    return null;
  }

  return (
    <section className="rounded-[var(--radius-brand-lg)] border border-brand-border bg-brand-white p-5 md:p-6">
      <h2 className="font-display text-xl font-bold text-brand-text">
        Ürün Özellikleri
      </h2>

      <div className="mt-5 space-y-5">
        {attributes.map((attribute) => (
          <div
            key={attribute.id}
            className="grid gap-3 border-b border-brand-border pb-5 last:border-b-0 last:pb-0 md:grid-cols-[180px_1fr]"
          >
            <h3 className="text-sm font-semibold text-brand-muted">
              {attribute.name}
            </h3>

            <div className="flex flex-wrap gap-2">
              {attribute.values.map((value) => (
                <span
                  key={value.id}
                  className="inline-flex items-center gap-2 rounded-full bg-brand-secondary px-4 py-2 text-sm font-semibold text-brand-text"
                >
                  {value.colorHex ? (
                    <span
                      className="h-4 w-4 rounded-full border border-brand-border"
                      style={{
                        backgroundColor: value.colorHex,
                      }}
                    />
                  ) : null}

                  {value.value}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}