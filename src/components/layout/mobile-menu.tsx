"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SearchBar } from "@/modules/search/components/search-bar";

interface Category {
  id: string;
  name: string;
  slug: string;
  children: { id: string; name: string; slug: string }[];
}

export function MobileMenu({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Body scroll kilidi
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [open]);

  // Escape tuşu
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const close = () => {
    setOpen(false);
    setExpandedId(null);
  };

  return (
    <>
      {/* Hamburger butonu — sadece mobilde görünür */}
      <button
        type="button"
        aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
        aria-expanded={open}
        aria-controls="mobile-drawer"
        onClick={() => setOpen(v => !v)}
        className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface-warm md:hidden"
      >
        {/* 3 çizgi → X animasyonu */}
        <span className="flex h-[18px] w-[18px] flex-col items-center justify-between">
          <span
            className="block h-[1.5px] w-full origin-center rounded-full bg-current transition-all duration-300"
            style={{ transform: open ? "translateY(8px) rotate(45deg)" : "none" }}
          />
          <span
            className="block h-[1.5px] w-full rounded-full bg-current transition-all duration-300"
            style={{ opacity: open ? 0 : 1, transform: open ? "scaleX(0)" : "none" }}
          />
          <span
            className="block h-[1.5px] w-full origin-center rounded-full bg-current transition-all duration-300"
            style={{ transform: open ? "translateY(-8px) rotate(-45deg)" : "none" }}
          />
        </span>
      </button>

      {/* Portal katmanları — header'ın z-index'inden (40) YÜKSEK olmalı */}

      {/* Overlay */}
      <div
        aria-hidden="true"
        onClick={close}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 60,
          background: "rgb(28 25 23 / 0.35)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Drawer */}
      <div
        id="mobile-drawer"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigasyon menüsü"
        style={{
          position: "fixed",
          inset: "0 auto 0 0",
          zIndex: 70,
          width: "min(340px, 88vw)",
          display: "flex",
          flexDirection: "column",
          background: "var(--surface)",
          boxShadow: "var(--shadow-xl)",
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.32s cubic-bezier(0.32,0,0.67,0)",
          overflowY: "auto",
        }}
        className="md:hidden"
      >
        {/* Başlık */}
        <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4">
          <span className="font-display text-sm font-semibold text-ink">Menü</span>
          <button
            type="button"
            onClick={close}
            aria-label="Menüyü kapat"
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink-3 transition hover:bg-surface-warm hover:text-ink"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Arama */}
        <div className="shrink-0 border-b border-border px-4 py-3">
          <SearchBar />
        </div>

        {/* Kategori listesi */}
        <nav aria-label="Mobil navigasyon" className="flex-1 overflow-y-auto px-3 py-3">
          <ul className="space-y-0.5">
            {categories.map(cat => (
              <li key={cat.id}>
                {cat.children.length > 0 ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setExpandedId(p => p === cat.id ? null : cat.id)}
                      className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-ink transition hover:bg-surface-warm"
                      aria-expanded={expandedId === cat.id}
                    >
                      <span>{cat.name}</span>
                      <svg
                        width="13" height="13" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                        className="shrink-0 transition-transform duration-200"
                        style={{ transform: expandedId === cat.id ? "rotate(180deg)" : "none" }}
                        aria-hidden="true"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </button>

                    {/* Alt kategoriler — CSS max-height geçişi */}
                    <div
                      style={{
                        overflow: "hidden",
                        maxHeight: expandedId === cat.id ? "20rem" : "0",
                        opacity: expandedId === cat.id ? 1 : 0,
                        transition: "max-height 0.3s ease, opacity 0.25s ease",
                      }}
                    >
                      <ul className="ml-4 mt-0.5 space-y-0.5 border-l border-border pl-3">
                        <li>
                          <Link
                            href={`/kategori/${cat.slug}`}
                            onClick={close}
                            className="block rounded-lg px-3 py-2 text-xs font-semibold text-amber transition hover:bg-amber-subtle"
                          >
                            Tümünü Gör →
                          </Link>
                        </li>
                        {cat.children.map(child => (
                          <li key={child.id}>
                            <Link
                              href={`/kategori/${child.slug}`}
                              onClick={close}
                              className="block rounded-lg px-3 py-2 text-sm text-ink-2 transition hover:bg-surface-warm hover:text-ink"
                            >
                              {child.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  <Link
                    href={`/kategori/${cat.slug}`}
                    onClick={close}
                    className="block rounded-xl px-4 py-3 text-sm font-medium text-ink transition hover:bg-surface-warm"
                  >
                    {cat.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Alt kısayollar */}
        <div className="shrink-0 border-t border-border px-5 py-4">
          <div className="flex flex-col gap-3 text-sm">
            <Link href="/siparis-takibi" onClick={close} className="flex items-center gap-2 text-ink-3 transition hover:text-amber">
              <span aria-hidden="true">📦</span> Sipariş Takibi
            </Link>
            <Link href="/giris" onClick={close} className="flex items-center gap-2 text-ink-3 transition hover:text-amber">
              <span aria-hidden="true">👤</span> Giriş Yap
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
