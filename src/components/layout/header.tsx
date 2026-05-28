import Image from "next/image";
import Link from "next/link";
import { HeaderCartButton } from "@/components/layout/header-cart-button";
import { getCachedNavCategories } from "@/server/application/layout/get-nav-categories.cached";

const NAV_CATEGORY_LIMIT = 4;

export async function Header() {
  const categories = await getCachedNavCategories();

  const visibleCategories = categories.slice(0, NAV_CATEGORY_LIMIT);
  const overflowCategories = categories.slice(NAV_CATEGORY_LIMIT);

  return (
    <header className="sticky top-0 z-50 border-b border-brand-border bg-brand-surface/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center"
          aria-label="Dastini Bebe Market Ana Sayfa"
        >
          <Image
            src="/logo.png"
            alt="Dastini Bebe Market"
            width={313}
            height={125}
            priority
            className="h-12 w-auto md:h-14"
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden flex-1 items-center justify-center md:flex">
          <nav aria-label="Ana menü">
            <ul className="flex items-center gap-1">
              {visibleCategories.map((cat) => (
                <li key={cat.id} className="relative group">
                  <Link
                    href={`/kategori/${cat.slug}`}
                    className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold text-brand-text transition hover:bg-brand-secondary hover:text-brand-primary-dark"
                  >
                    {cat.name}
                    {cat.children.length > 0 && (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mt-0.5 transition-transform group-hover:rotate-180"
                        aria-hidden
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    )}
                  </Link>

                  {cat.children.length > 0 && (
                    <div className="absolute left-0 top-full pt-1 hidden group-hover:block z-50 min-w-[180px]">
                      <ul className="rounded-xl border border-brand-border bg-brand-white py-1.5 shadow-lg">
                        {cat.children.map((child) => (
                          <li key={child.id}>
                            <Link
                              href={`/kategori/${child.slug}`}
                              className="block px-4 py-2 text-sm text-brand-text transition hover:bg-brand-secondary hover:text-brand-primary-dark"
                            >
                              {child.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}

              {overflowCategories.length > 0 && (
                <li className="relative group">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold text-brand-text transition hover:bg-brand-secondary hover:text-brand-primary-dark"
                  >
                    Diğer Kategoriler
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mt-0.5 transition-transform group-hover:rotate-180"
                      aria-hidden
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>

                  <div className="absolute right-0 top-full pt-1 hidden group-hover:block z-50 min-w-[200px]">
                    <ul className="max-h-[70vh] overflow-y-auto rounded-xl border border-brand-border bg-brand-white py-1.5 shadow-lg">
                      {overflowCategories.map((cat) => (
                        <li key={cat.id}>
                          <Link
                            href={`/kategori/${cat.slug}`}
                            className="block px-4 py-2 text-sm font-medium text-brand-text transition hover:bg-brand-secondary hover:text-brand-primary-dark"
                          >
                            {cat.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              )}
            </ul>
          </nav>
        </div>

        {/* Sağ aksiyonlar */}
        <div className="flex items-center gap-2">
          <Link
            href="/giris"
            className="hidden rounded-full border border-brand-border bg-brand-white px-4 py-2 text-sm font-semibold text-brand-text transition hover:bg-brand-secondary sm:inline-flex"
          >
            Giriş Yap
          </Link>
          <HeaderCartButton />
        </div>
      </div>

      {/* Mobil yatay scroll nav */}
      <div className="border-t border-brand-border md:hidden">
        <nav
          aria-label="Mobil ana menü"
          className="mx-auto flex w-full max-w-7xl gap-2 overflow-x-auto px-4 py-3 scrollbar-none"
        >
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/kategori/${cat.slug}`}
              className="shrink-0 rounded-full border border-brand-border bg-brand-white px-4 py-2 text-sm font-semibold text-brand-text transition hover:bg-brand-secondary"
            >
              {cat.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
