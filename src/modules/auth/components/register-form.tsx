"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

const inputClass =
  "w-full rounded-2xl border border-brand-border bg-brand-surface px-4 py-3 text-sm text-brand-text outline-none transition focus:border-brand-primary";

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone || undefined,
        password: form.password,
      }),
    });

    if (response.ok) {
      router.replace("/hesap");
      router.refresh();
      return;
    }

    const data = (await response.json().catch(() => ({}))) as {
      message?: string;
    };
    setError(data.message ?? "Kayıt başarısız oldu.");
    setIsSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-brand-muted">Ad</span>
          <input
            type="text"
            required
            value={form.firstName}
            onChange={(event) => update("firstName", event.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-brand-muted">Soyad</span>
          <input
            type="text"
            required
            value={form.lastName}
            onChange={(event) => update("lastName", event.target.value)}
            className={inputClass}
          />
        </label>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-brand-muted">E-posta</span>
        <input
          type="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={(event) => update("email", event.target.value)}
          className={inputClass}
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-brand-muted">
          Telefon (opsiyonel)
        </span>
        <input
          type="tel"
          autoComplete="tel"
          value={form.phone}
          onChange={(event) => update("phone", event.target.value)}
          className={inputClass}
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-brand-muted">
          Parola (en az 6 karakter)
        </span>
        <input
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          value={form.password}
          onChange={(event) => update("password", event.target.value)}
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
        {isSubmitting ? "Hesap oluşturuluyor…" : "Kayıt Ol"}
      </button>

      <p className="text-center text-sm text-brand-muted">
        Zaten hesabın var mı?{" "}
        <Link
          href="/giris"
          className="font-semibold text-brand-primary-dark hover:underline"
        >
          Giriş yap
        </Link>
      </p>
    </form>
  );
}
