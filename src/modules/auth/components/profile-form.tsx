"use client";

import { useState, type FormEvent } from "react";
import type { Customer } from "@/server/domain/entities/customer.entity";

const inputCls =
  "w-full rounded-[var(--radius-md)] border border-border bg-surface px-4 py-3 text-sm text-ink outline-none transition focus:border-amber focus:ring-2 focus:ring-amber/20 placeholder:text-ink-4";

export function ProfileForm({ customer }: { customer: Customer }) {
  const [form, setForm] = useState({
    firstName: customer.firstName,
    lastName: customer.lastName,
    phone: customer.phone ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const update = (field: keyof typeof form, value: string) =>
    setForm(p => ({ ...p, [field]: value }));

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    const res = await fetch("/api/auth/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      const data = await res.json().catch(() => ({})) as { message?: string };
      setError(data.message ?? "Güncelleme başarısız.");
    }
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
        <input type="email" disabled value={customer.email}
          className={`${inputCls} cursor-not-allowed opacity-60`} />
      </label>

      <label className="block space-y-1.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-3">
          Telefon <span className="font-normal normal-case text-ink-4">(opsiyonel)</span>
        </span>
        <input type="tel" value={form.phone}
          onChange={e => update("phone", e.target.value)}
          className={inputCls} placeholder="05xx xxx xx xx" />
      </label>

      {error && (
        <p className="rounded-[var(--radius-sm)] bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}
      {success && (
        <p className="rounded-[var(--radius-sm)] bg-sage-subtle px-4 py-3 text-sm font-medium text-sage">
          ✓ Bilgileriniz güncellendi.
        </p>
      )}

      <button type="submit" disabled={loading} className="btn-amber text-sm disabled:opacity-60">
        {loading ? "Kaydediliyor…" : "Değişiklikleri Kaydet"}
      </button>
    </form>
  );
}
