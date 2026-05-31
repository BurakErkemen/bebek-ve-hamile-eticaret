import Image from "next/image";
import Link from "next/link";
import { HeaderAccountButton } from "@/components/layout/header-account-button";
import { HeaderCartButton } from "@/components/layout/header-cart-button";
import { HeaderShell } from "@/components/layout/header-shell";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { SearchBar } from "@/modules/search/components/search-bar";
import { getCachedNavCategories } from "@/server/application/layout/get-nav-categories.cached";

const NAV_LIMIT = 5;

export async function Header() {
  const categories = await getCachedNavCategories();
  const visible = categories.slice(0, NAV_LIMIT);
  const overflow = categories.slice(NAV_LIMIT);

  return (
    <HeaderShell>
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-6 lg:px-8">
        <MobileMenu categories={categories} />

        <Link href="/" aria-label="Dastini Ana Sayfa" className="shrink-0">
          <Image src="/logo.png" alt="Dastini" width={313} height={125} priority
            className="h-9 w-auto transition-opacity duration-200 hover:opacity-80 md:h-10" />
        </Link>

        <nav aria-label="Ana menü" className="hidden flex-1 justify-center md:flex">
          <ul className="flex items-center">
            {visible.map(cat => (
              <li key={cat.id} className="group relative">
                <Link href={`/kategori/${cat.slug}`}
                  className="inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium text-ink-2 transition-all duration-200 hover:bg-surface-warm hover:text-ink">
                  {cat.name}
                  {cat.children.length > 0 && (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
                      className="mt-px transition-transform duration-200 group-hover:rotate-180" aria-hidden="true">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  )}
                </Link>
                {cat.children.length > 0 && (
                  <div className="invisible absolute left-0 top-full z-50 min-w-[200px] pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                    <ul className="overflow-hidden rounded-xl border border-border bg-surface-card py-1.5 shadow-lg">
                      {cat.children.map(child => (
                        <li key={child.id}>
                          <Link href={`/kategori/${child.slug}`}
                            className="block px-4 py-2.5 text-sm text-ink-2 transition hover:bg-surface-warm hover:text-ink">
                            {child.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
            {overflow.length > 0 && (
              <li className="group relative">
                <button type="button"
                  className="inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium text-ink-2 transition-all duration-200 hover:bg-surface-warm hover:text-ink">
                  Diğerleri
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
                    className="mt-px transition-transform duration-200 group-hover:rotate-180" aria-hidden="true">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
                <div className="invisible absolute right-0 top-full z-50 min-w-[210px] pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                  <ul className="max-h-[70vh] overflow-y-auto rounded-xl border border-border bg-surface-card py-1.5 shadow-lg">
                    {overflow.map(cat => (
                      <li key={cat.id}>
                        <Link href={`/kategori/${cat.slug}`}
                          className="block px-4 py-2.5 text-sm text-ink-2 transition hover:bg-surface-warm hover:text-ink">
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

        <div className="flex items-center gap-1.5">
          <SearchBar className="hidden w-48 lg:flex xl:w-56" />
          <HeaderAccountButton />
          <HeaderCartButton />
        </div>
      </div>

      <div className="border-t border-border/60 px-4 py-2.5 lg:hidden">
        <div className="mx-auto max-w-7xl">
          <SearchBar />
        </div>
      </div>
    </HeaderShell>
  );
}
