"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

const inputCls =
  "w-full rounded-[var(--radius-md)] border border-border bg-surface px-4 py-3 text-sm text-ink outline-none transition focus:border-amber focus:ring-2 focus:ring-amber/20 placeholder:text-ink-4";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const params = new URLSearchParams(window.location.search);
      const next = params.get("next");
      router.replace(next?.startsWith("/") ? next : "/hesap");
      router.refresh();
      return;
    }

    const data = await res.json().catch(() => ({})) as { message?: string };
    setError(data.message ?? "Giriş başarısız oldu.");
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block space-y-1.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-3">E-posta</span>
        <input
          type="email" autoComplete="email" required
          value={email} onChange={e => setEmail(e.target.value)}
          className={inputCls} placeholder="ornek@mail.com"
        />
      </label>

      <label className="block space-y-1.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-3">Parola</span>
        <input
          type="password" autoComplete="current-password" required
          value={password} onChange={e => setPassword(e.target.value)}
          className={inputCls} placeholder="••••••"
        />
      </label>

      <div className="text-right">
        <Link href="/sifremi-unuttum" className="text-xs text-ink-3 transition hover:text-amber">
          Şifremi unuttum
        </Link>
      </div>

      {error && (
        <p className="rounded-[var(--radius-sm)] bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      <button type="submit" disabled={loading} className="btn-amber w-full disabled:opacity-60">
        {loading ? "Giriş yapılıyor…" : "Giriş Yap"}
      </button>

      <p className="text-center text-sm text-ink-3">
        Hesabın yok mu?{" "}
        <Link href="/kayit" className="font-semibold text-amber underline-offset-2 hover:underline">
          Kayıt ol
        </Link>
      </p>
    </form>
  );
}
