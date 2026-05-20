import Link from "next/link";

type ProductBreadcrumbProps = {
  categoryName: string;
  categorySlug: string;
  productName: string;
};

export function ProductBreadcrumb({
  categoryName,
  categorySlug,
  productName,
}: ProductBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-brand-muted">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link
            href="/"
            className="transition hover:text-brand-primary-dark"
          >
            Ana Sayfa
          </Link>
        </li>

        <li aria-hidden="true">/</li>

        <li>
          <Link
            href={`/kategori/${categorySlug}`}
            className="transition hover:text-brand-primary-dark"
          >
            {categoryName}
          </Link>
        </li>

        <li aria-hidden="true">/</li>

        <li>
          <span className="font-medium text-brand-text">
            {productName}
          </span>
        </li>
      </ol>
    </nav>
  );
}