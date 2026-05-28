"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "announcement-bar-dismissed";

const currencyFormatter = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 0,
});

export function AnnouncementBar({
  freeShippingThreshold,
}: {
  freeShippingThreshold?: number | null;
}) {
  const [isVisible, setIsVisible] = useState(true);

  const message =
    freeShippingThreshold && freeShippingThreshold > 0
      ? `${currencyFormatter.format(freeShippingThreshold)} ve üzeri alışverişlerde kargo ücretsiz!`
      : "Yeni sezon bebek ve hamile ürünleri mağazamızda!";

  useEffect(() => {
    // localStorage yalnızca mount sonrası okunabilir; hydration uyumsuzluğunu
    // önlemek için kapatma tercihi burada uygulanır.
    if (localStorage.getItem(STORAGE_KEY) === "1") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsVisible(false);
    }
  }, []);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, "1");
    setIsVisible(false);
  }

  if (!isVisible) {
    return null;
  }

  return (
    <div className="border-b border-brand-border bg-brand-secondary">
      <div className="relative mx-auto flex min-h-10 w-full max-w-7xl items-center justify-center gap-3 px-4 text-center text-sm font-medium text-brand-text md:px-6 lg:px-8">
        <p>{message}</p>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Duyuruyu kapat"
          className="absolute right-2 flex h-7 w-7 items-center justify-center rounded-full text-brand-text/70 transition hover:bg-brand-border/40 hover:text-brand-text md:right-4"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
