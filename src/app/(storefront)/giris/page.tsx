import { redirect } from "next/navigation";
import { getCurrentCustomer } from "@/server/application/auth/get-current-customer";
import { LoginForm } from "@/modules/auth/components/login-form";

export const metadata = {
  title: "Giriş Yap",
};

export default async function LoginPage() {
  const customer = await getCurrentCustomer();
  if (customer) {
    redirect("/hesap");
  }

  return (
    <main className="mx-auto w-full max-w-md px-4 py-12 md:py-16">
      <div className="rounded-[var(--radius-brand-xl)] border border-brand-border bg-brand-white p-6 md:p-8">
        <h1 className="font-display text-2xl font-bold text-brand-text">
          Giriş Yap
        </h1>
        <p className="mt-1 mb-6 text-sm text-brand-muted">
          Hesabınla giriş yaparak siparişlerini takip edebilirsin.
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
