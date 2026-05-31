"use client";

import { useState, type FormEvent } from "react";

const inputCls =
  "w-full rounded-[var(--radius-md)] border border-border bg-surface px-4 py-3 text-sm text-ink outline-none transition focus:border-amber focus:ring-2 focus:ring-amber/20 placeholder:text-ink-4";

export function ForgotPasswordForm() {
  const [email, setEmail]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [sent, setSent]         = useState(false);
  const [error, setError]       = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/auth/reset-password/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json().catch(() => ({})) as { message?: string };

    if (res.ok) {
      setSent(true);
    } else {
      setError(data.message ?? "Bir hata oluştu, lütfen tekrar deneyin.");
    }

    setLoading(false);
  }

  if (sent) {
    return (
      <div className="rounded-[var(--radius-md)] bg-sage-subtle p-5 text-sm text-ink-2">
        <p className="font-semibold text-sage">✓ Gönderildi</p>
        <p className="mt-1">
          E-postanız kayıtlıysa kısa süre içinde şifre sıfırlama bağlantısı gelecek.
          Gelen kutunuzu ve spam klasörünüzü kontrol edin.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block space-y-1.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-3">E-posta</span>
        <input
          type="email" required autoComplete="email"
          value={email} onChange={e => setEmail(e.target.value)}
          className={inputCls} placeholder="ornek@mail.com"
        />
      </label>

      {error && (
        <p className="rounded-[var(--radius-sm)] bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      <button type="submit" disabled={loading} className="btn-amber w-full disabled:opacity-60">
        {loading ? "Gönderiliyor…" : "Sıfırlama Bağlantısı Gönder"}
      </button>
    </form>
  );
}
