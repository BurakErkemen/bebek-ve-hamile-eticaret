import Link from "next/link";

type CategoryBreadcrumbProps = {
  categoryName: string;
};

export function CategoryBreadcrumb({
  categoryName,
}: CategoryBreadcrumbProps) {
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
          <span className="font-medium text-brand-text">
            {categoryName}
          </span>
        </li>
      </ol>
    </nav>
  );
}