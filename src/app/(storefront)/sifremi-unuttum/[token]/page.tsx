import { ResetPasswordForm } from "@/modules/auth/components/reset-password-form";

export const metadata = { title: "Yeni Şifre Belirle" };

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return (
    <main className="mx-auto w-full max-w-md px-4 py-12 md:py-16">
      <div className="rounded-[var(--radius-xl)] border border-border bg-surface-card p-6 shadow-[var(--shadow-sm)] md:p-8">
        <h1 className="font-display text-2xl font-bold text-ink">Yeni Şifre Belirle</h1>
        <p className="mt-1 mb-6 text-sm text-ink-3">En az 6 karakter olmalıdır.</p>
        <ResetPasswordForm token={decodeURIComponent(token)} />
      </div>
    </main>
  );
}
