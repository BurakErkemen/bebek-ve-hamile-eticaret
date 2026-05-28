import { redirect } from "next/navigation";
import { getCurrentCustomer } from "@/server/application/auth/get-current-customer";
import { RegisterForm } from "@/modules/auth/components/register-form";

export const metadata = {
  title: "Kayıt Ol",
};

export default async function RegisterPage() {
  const customer = await getCurrentCustomer();
  if (customer) {
    redirect("/hesap");
  }

  return (
    <main className="mx-auto w-full max-w-md px-4 py-12 md:py-16">
      <div className="rounded-[var(--radius-brand-xl)] border border-brand-border bg-brand-white p-6 md:p-8">
        <h1 className="font-display text-2xl font-bold text-brand-text">
          Hesap Oluştur
        </h1>
        <p className="mt-1 mb-6 text-sm text-brand-muted">
          Hızlı ödeme ve sipariş takibi için bir hesap oluştur.
        </p>
        <RegisterForm />
      </div>
    </main>
  );
}
