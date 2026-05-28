"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

const inputClass =
  "w-full rounded-2xl border border-brand-border bg-brand-surface px-4 py-3 text-sm text-brand-text outline-none transition focus:border-brand-primary";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const params = new URLSearchParams(window.location.search);
      const next = params.get("next");
      router.replace(next && next.startsWith("/") ? next : "/hesap");
      router.refresh();
      return;
    }

    const data = (await response.json().catch(() => ({}))) as {
      message?: string;
    };
    setError(data.message ?? "Giriş başarısız oldu.");
    setIsSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block space-y-2">
        <span className="text-sm font-medium text-brand-muted">E-posta</span>
        <input
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={inputClass}
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-brand-muted">Parola</span>
        <input
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className={inputClass}
        />
      </label>

      {error && (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold text-brand-white transition hover:bg-brand-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Giriş yapılıyor…" : "Giriş Yap"}
      </button>

      <p className="text-center text-sm text-brand-muted">
        Hesabın yok mu?{" "}
        <Link
          href="/kayit"
          className="font-semibold text-brand-primary-dark hover:underline"
        >
          Kayıt ol
        </Link>
      </p>
    </form>
  );
}
