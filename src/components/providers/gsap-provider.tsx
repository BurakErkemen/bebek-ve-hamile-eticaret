"use client";

/**
 * Scroll-reveal artık TAMAMEN saf CSS ile yapılıyor
 * (`animation-timeline: view()` — bkz. globals.css).
 *
 * JavaScript reveal sistemi kaldırıldı çünkü React'ın kontrol ettiği
 * `className`'i dışarıdan değiştirmek (classList.add) hydration mismatch'e
 * yol açıyordu. CSS scroll-driven animation tarayıcı tarafından çalışır,
 * React hiçbir DOM mutasyonu görmez → mismatch yapısal olarak imkânsız.
 *
 * Bu bileşen geriye dönük uyumluluk için korunuyor (layout onu sarıyor);
 * ileride başka global animasyon davranışı eklenirse buraya gelir.
 */
export function GSAPProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
