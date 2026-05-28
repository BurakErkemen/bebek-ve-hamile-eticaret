import { CheckoutPageContent } from "@/modules/checkout/components/checkout-page-content";
import { getCurrentCustomer } from "@/server/application/auth/get-current-customer";
import { getShippingConfig } from "@/server/application/layout/get-shipping-config.cached";

export const metadata = {
  title: "Ödeme",
};

export default async function CheckoutPage() {
  const [shippingConfig, customer] = await Promise.all([
    getShippingConfig(),
    getCurrentCustomer(),
  ]);

  const initialCustomer = customer
    ? {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone ?? "",
      }
    : undefined;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 md:py-10 lg:px-8">
      <div className="mb-8">
        <p className="font-display text-sm font-bold uppercase tracking-[0.18em] text-brand-primary-dark">
          Checkout
        </p>

        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-brand-text md:text-4xl">
          Teslimat ve Sipariş Bilgileri
        </h1>
      </div>

      <CheckoutPageContent
        shippingConfig={shippingConfig}
        initialCustomer={initialCustomer}
      />
    </main>
  );
}
