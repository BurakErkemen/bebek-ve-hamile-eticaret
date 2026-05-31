"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

const inputCls =
  "w-full rounded-[var(--radius-md)] border border-border bg-surface px-4 py-3 text-sm text-ink outline-none transition focus:border-amber focus:ring-2 focus:ring-amber/20 placeholder:text-ink-4";

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [password, setPassword]   = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [done, setDone]           = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (password !== password2) {
      setError("Şifreler eşleşmiyor.");
      return;
    }
    setLoading(true);
    setError(null);

    const res = await fetch("/api/auth/reset-password/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json().catch(() => ({})) as { message?: string };

    if (res.ok) {
      setDone(true);
      setTimeout(() => router.replace("/giris"), 2500);
    } else {
      setError(data.message ?? "Bir hata oluştu.");
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-[var(--radius-md)] bg-sage-subtle p-5 text-sm text-ink-2">
        <p className="font-semibold text-sage">✓ Şifreniz güncellendi</p>
        <p className="mt-1">Giriş sayfasına yönlendiriliyorsunuz…</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block space-y-1.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-3">Yeni Şifre</span>
        <input
          type="password" required minLength={6}
          value={password} onChange={e => setPassword(e.target.value)}
          className={inputCls} placeholder="••••••"
        />
      </label>

      <label className="block space-y-1.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-3">Şifre Tekrar</span>
        <input
          type="password" required minLength={6}
          value={password2} onChange={e => setPassword2(e.target.value)}
          className={inputCls} placeholder="••••••"
        />
      </label>

      {error && (
        <p className="rounded-[var(--radius-sm)] bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      <button type="submit" disabled={loading} className="btn-amber w-full disabled:opacity-60">
        {loading ? "Kaydediliyor…" : "Şifremi Güncelle"}
      </button>

      <p className="text-center text-sm text-ink-3">
        <Link href="/giris" className="text-amber hover:underline underline-offset-2">
          Giriş sayfasına dön
        </Link>
      </p>
    </form>
  );
}
