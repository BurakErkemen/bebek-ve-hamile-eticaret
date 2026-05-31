import { ForgotPasswordForm } from "@/modules/auth/components/forgot-password-form";

export const metadata = { title: "Şifremi Unuttum" };

export default function ForgotPasswordPage() {
  return (
    <main className="mx-auto w-full max-w-md px-4 py-12 md:py-16">
      <div className="rounded-[var(--radius-xl)] border border-border bg-surface-card p-6 shadow-[var(--shadow-sm)] md:p-8">
        <h1 className="font-display text-2xl font-bold text-ink">Şifremi Unuttum</h1>
        <p className="mt-1 mb-6 text-sm text-ink-3">
          E-posta adresinizi girin, şifre sıfırlama bağlantısı gönderelim.
        </p>
        <ForgotPasswordForm />
      </div>
    </main>
  );
}
