"use client";

import { useState } from "react";
import { SETTING_KEYS } from "@/server/domain/entities/site-setting.entity";
import type { SiteSettingsMap } from "@/server/domain/entities/site-setting.entity";
import { THEME_COLORS } from "@/shared/theme/theme-colors";

type Props = { initialSettings: SiteSettingsMap };

const SOCIAL_FIELDS = [
  { key: SETTING_KEYS.SOCIAL_INSTAGRAM, label: "Instagram", placeholder: "https://instagram.com/hesap" },
  { key: SETTING_KEYS.SOCIAL_FACEBOOK, label: "Facebook", placeholder: "https://facebook.com/sayfa" },
  { key: SETTING_KEYS.SOCIAL_TIKTOK, label: "TikTok", placeholder: "https://tiktok.com/@hesap" },
  { key: SETTING_KEYS.SOCIAL_YOUTUBE, label: "YouTube", placeholder: "https://youtube.com/@kanal" },
  { key: SETTING_KEYS.SOCIAL_TWITTER, label: "X (Twitter)", placeholder: "https://x.com/hesap" },
];

function inputClass() {
  return "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors";
}

export default function SiteSettingsForm({ initialSettings }: Props) {
  const [values, setValues] = useState<SiteSettingsMap>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setSaving(false);
    if (!res.ok) { setError("Kaydedilemedi."); return; }
    setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">

      {/* İletişim Bilgileri */}
      <section className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Footer İletişim Bilgileri</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">E-posta</label>
            <input
              type="email"
              value={values[SETTING_KEYS.FOOTER_EMAIL] ?? ""}
              onChange={(e) => set(SETTING_KEYS.FOOTER_EMAIL, e.target.value)}
              placeholder="info@siteniz.com"
              className={inputClass()}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Telefon</label>
            <input
              type="text"
              value={values[SETTING_KEYS.FOOTER_PHONE] ?? ""}
              onChange={(e) => set(SETTING_KEYS.FOOTER_PHONE, e.target.value)}
              placeholder="+90 555 000 00 00"
              className={inputClass()}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Adres</label>
            <textarea
              value={values[SETTING_KEYS.FOOTER_ADDRESS] ?? ""}
              onChange={(e) => set(SETTING_KEYS.FOOTER_ADDRESS, e.target.value)}
              placeholder="Şehir, İlçe / Türkiye"
              rows={2}
              className={`${inputClass()} resize-none`}
            />
          </div>
        </div>
      </section>

      {/* Site Renkleri */}
      <section className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Site Renkleri</h2>
          <p className="text-xs text-gray-400 mt-0.5">Mağaza temasının renklerini düzenleyin. Değişiklikler tüm site genelinde uygulanır.</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {THEME_COLORS.map((color) => {
              const current = values[color.key] || color.default;
              return (
                <div key={color.key} className="flex items-center gap-3">
                  <input
                    type="color"
                    value={current}
                    onChange={(e) => set(color.key, e.target.value)}
                    className="h-9 w-12 shrink-0 cursor-pointer rounded-lg border border-gray-200 bg-white p-0.5"
                    aria-label={color.label}
                  />
                  <div className="min-w-0 flex-1">
                    <label className="block text-xs font-medium text-gray-500">{color.label}</label>
                    <input
                      type="text"
                      value={current}
                      onChange={(e) => set(color.key, e.target.value)}
                      className="mt-0.5 w-full border-0 p-0 text-sm font-mono text-gray-700 focus:outline-none focus:ring-0"
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => {
              setValues((prev) => {
                const next = { ...prev };
                for (const c of THEME_COLORS) next[c.key] = "";
                return next;
              });
              setSaved(false);
            }}
            className="mt-5 text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors"
          >
            Renkleri varsayılana sıfırla
          </button>
        </div>
      </section>

      {/* Sosyal Medya */}
      <section className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Sosyal Medya Bağlantıları</h2>
          <p className="text-xs text-gray-400 mt-0.5">Boş bırakılan platformlar footer bölümünde gösterilmez.</p>
        </div>
        <div className="p-6 space-y-4">
          {SOCIAL_FIELDS.map((field) => (
            <div key={field.key}>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">{field.label}</label>
              <input
                type="url"
                value={values[field.key] ?? ""}
                onChange={(e) => set(field.key, e.target.value)}
                placeholder={field.placeholder}
                className={inputClass()}
              />
            </div>
          ))}
        </div>
      </section>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {saved && (
        <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3">
          <p className="text-sm text-green-700">Ayarlar kaydedildi.</p>
        </div>
      )}

      <div>
        <button type="submit" disabled={saving}
          className="inline-flex items-center gap-1.5 bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors">
          {saving && (
            <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>
    </form>
  );
}
