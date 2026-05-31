"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

const inputCls =
  "w-full rounded-[var(--radius-md)] border border-border bg-surface px-4 py-3 text-sm text-ink outline-none transition focus:border-amber focus:ring-2 focus:ring-amber/20 placeholder:text-ink-4";

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", password: "",
  });
  const [error, setError]     = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const update = (field: keyof typeof form, value: string) =>
    setForm(p => ({ ...p, [field]: value }));

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/auth/register", {
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

    if (res.ok) {
      router.replace("/hesap");
      router.refresh();
      return;
    }

    const data = await res.json().catch(() => ({})) as { message?: string };
    setError(data.message ?? "Kayıt başarısız oldu.");
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-3">Ad</span>
          <input type="text" required value={form.firstName}
            onChange={e => update("firstName", e.target.value)} className={inputCls} />
        </label>
        <label className="block space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-3">Soyad</span>
          <input type="text" required value={form.lastName}
            onChange={e => update("lastName", e.target.value)} className={inputCls} />
        </label>
      </div>

      <label className="block space-y-1.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-3">E-posta</span>
        <input type="email" autoComplete="email" required value={form.email}
          onChange={e => update("email", e.target.value)} className={inputCls} placeholder="ornek@mail.com" />
      </label>

      <label className="block space-y-1.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-3">
          Telefon <span className="font-normal normal-case text-ink-4">(opsiyonel)</span>
        </span>
        <input type="tel" autoComplete="tel" value={form.phone}
          onChange={e => update("phone", e.target.value)} className={inputCls} placeholder="05xx xxx xx xx" />
      </label>

      <label className="block space-y-1.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-3">
          Parola <span className="font-normal normal-case text-ink-4">(en az 6 karakter)</span>
        </span>
        <input type="password" autoComplete="new-password" required minLength={6}
          value={form.password} onChange={e => update("password", e.target.value)}
          className={inputCls} placeholder="••••••" />
      </label>

      {error && (
        <p className="rounded-[var(--radius-sm)] bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      <button type="submit" disabled={loading} className="btn-amber w-full disabled:opacity-60">
        {loading ? "Hesap oluşturuluyor…" : "Kayıt Ol"}
      </button>

      <p className="text-center text-sm text-ink-3">
        Zaten hesabın var mı?{" "}
        <Link href="/giris" className="font-semibold text-amber underline-offset-2 hover:underline">
          Giriş yap
        </Link>
      </p>
    </form>
  );
}
