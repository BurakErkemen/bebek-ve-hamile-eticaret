import Link from "next/link";
import { HeaderCartButton } from "@/components/layout/header-cart-button";

const mainNavigation = [
  {
    label: "Bebek Giyim",
    href: "/kategori/bebek-giyim",
  },
  {
    label: "Hamile Giyim",
    href: "/kategori/hamile-giyim",
  },
  {
    label: "Anne Bebek",
    href: "/kategori/anne-bebek",
  },
  {
    label: "Kampanyalar",
    href: "/kampanyalar",
  },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-brand-border bg-brand-surface/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-6 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 flex-col leading-none"
          aria-label="Bebek ve Hamile Giyim Ana Sayfa"
        >
          <span className="font-display text-xl font-bold tracking-tight text-brand-text md:text-2xl">
            Bebek & Hamile
          </span>
          <span className="mt-1 text-xs font-medium text-brand-muted">
            Güvenli ve yumuşak alışveriş
          </span>
        </Link>

        <div className="hidden flex-1 items-center justify-center md:flex">
          <nav aria-label="Ana menü">
            <ul className="flex items-center gap-2">
              {mainNavigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex rounded-full px-4 py-2 text-sm font-semibold text-brand-text transition hover:bg-brand-secondary hover:text-brand-primary-dark"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

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

      <div className="border-t border-brand-border md:hidden">
        <nav
          aria-label="Mobil ana menü"
          className="mx-auto flex w-full max-w-7xl gap-2 overflow-x-auto px-4 py-3"
        >
          {mainNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-full border border-brand-border bg-brand-white px-4 py-2 text-sm font-semibold text-brand-text transition hover:bg-brand-secondary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}