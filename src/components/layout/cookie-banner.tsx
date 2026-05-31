"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const COOKIE_KEY = "dastini_cookie_consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Daha önce onay verilmediyse göster
    try {
      if (!localStorage.getItem(COOKIE_KEY)) setVisible(true);
    } catch {
      // localStorage erişim hatası — sessizce geç
    }
  }, []);

  const accept = () => {
    try { localStorage.setItem(COOKIE_KEY, "accepted"); } catch { /* ignore */ }
    setVisible(false);
  };

  const reject = () => {
    try { localStorage.setItem(COOKIE_KEY, "rejected"); } catch { /* ignore */ }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Çerez bildirimi"
      aria-live="polite"
      className="fixed bottom-4 left-4 right-4 z-[80] mx-auto max-w-2xl"
    >
      <div className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-border bg-surface-card p-5 shadow-[var(--shadow-xl)] sm:flex-row sm:items-center sm:gap-6">
        <div className="flex-1">
          <p className="text-sm font-semibold text-ink">🍪 Çerez Politikası</p>
          <p className="mt-1 text-xs leading-relaxed text-ink-3">
            Siteyi iyileştirmek ve size kişiselleştirilmiş deneyim sunmak için çerez kullanıyoruz.{" "}
            <Link href="/sayfa/gizlilik-politikasi" className="font-medium text-amber underline-offset-2 hover:underline">
              Gizlilik Politikası
            </Link>
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={reject}
            className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-ink-3 transition hover:bg-surface-warm"
          >
            Reddet
          </button>
          <button
            type="button"
            onClick={accept}
            className="btn-amber px-4 py-2 text-xs"
          >
            Kabul Et
          </button>
        </div>
      </div>
    </div>
  );
}
