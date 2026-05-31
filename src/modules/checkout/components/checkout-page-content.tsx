"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useCartStore } from "@/modules/cart/store/cart.store";
import {
  calculateCartSubtotal,
  calculateCartTotalItems,
} from "@/modules/cart/utils/cart-calculations";
import { PaytrIframe } from "@/modules/checkout/components/paytr-iframe";
import { formatTRY } from "@/shared/utils/format-currency";
import {
  calculateShippingFee,
  type ShippingConfig,
} from "@/shared/utils/shipping";

type DraftOrderResponse = {
  orderId: string;
  orderNumber: string;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
};

type CheckoutFormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  country: string;
  city: string;
  district: string;
  neighborhood: string;
  postalCode: string;
  addressLine: string;

  note: string;
};

const initialFormState: CheckoutFormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",

  country: "Türkiye",
  city: "",
  district: "",
  neighborhood: "",
  postalCode: "",
  addressLine: "",

  note: "",
};


type InitialCustomer = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export function CheckoutPageContent({
  shippingConfig,
  initialCustomer,
}: {
  shippingConfig: ShippingConfig;
  initialCustomer?: InitialCustomer;
}) {
  const items = useCartStore((state) => state.items);
  const hasHydrated = useCartStore((state) => state.hasHydrated);

  const [formState, setFormState] = useState<CheckoutFormState>({
    ...initialFormState,
    ...(initialCustomer ?? {}),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [contractAccepted, setContractAccepted] = useState(false);
  const [createdOrder, setCreatedOrder] =
    useState<DraftOrderResponse | null>(null);
  const [paytrIframeToken, setPaytrIframeToken] = useState("");

  const subtotal = calculateCartSubtotal(items);
  const totalItems = calculateCartTotalItems(items);
  const shippingFee = calculateShippingFee(subtotal, shippingConfig);
  const total = subtotal + shippingFee;
  const freeShippingRemaining =
    shippingConfig.freeThreshold !== null && shippingFee > 0
      ? shippingConfig.freeThreshold - subtotal
      : 0;

  const checkoutItems = useMemo(() => {
    return items.map((item) => ({
      variantId: item.variantId,
      quantity: item.quantity,
    }));
  }, [items]);

  function updateField<K extends keyof CheckoutFormState>(
    field: K,
    value: CheckoutFormState[K],
  ) {
    setFormState((currentState) => ({
      ...currentState,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setCreatedOrder(null);

    if (items.length === 0) {
      setErrorMessage("Ödeme adımına geçmek için sepetinizde ürün olmalı.");
      return;
    }
    if (formState.addressLine.trim().length < 10) {
      setErrorMessage(
        "Açık adres en az 10 karakter olmalıdır.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: {
            firstName: formState.firstName,
            lastName: formState.lastName,
            email: formState.email,
            phone: formState.phone,
          },
          shippingAddress: {
            country: formState.country,
            city: formState.city,
            district: formState.district,
            neighborhood: formState.neighborhood || undefined,
            postalCode: formState.postalCode || undefined,
            addressLine: formState.addressLine,
          },
          note: formState.note || undefined,
          items: checkoutItems,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        const issueMessage =
          Array.isArray(result.issues) && result.issues.length > 0
            ? result.issues
                .map(
                  (issue: { path?: string; message?: string }) =>
                    `${issue.path ?? "alan"}: ${issue.message ?? "geçersiz"}`,
                )
                .join(" | ")
            : "";

        setErrorMessage(
          issueMessage
            ? `${result.message ?? "Checkout formu geçersiz."} ${issueMessage}`
            : result.message ??
                "Sipariş hazırlanırken bir doğrulama hatası oluştu.",
        );

        return;
      }
    setCreatedOrder(result.order);

    const paymentResponse = await fetch("/api/payment/paytr/initiate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId: result.order.orderId,
      }),
    });

    const paymentResult = await paymentResponse.json();

    if (!paymentResponse.ok) {
      setErrorMessage(
        paymentResult.message ??
          "PayTR ödeme oturumu oluşturulamadı.",
      );
      return;
    }

    setPaytrIframeToken(paymentResult.payment.iframeToken);
    } catch {
      setErrorMessage(
        "Checkout isteği gönderilemedi. Lütfen tekrar deneyin.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!hasHydrated) {
    return (
      <section className="rounded-[var(--radius-brand-xl)] border border-brand-border bg-brand-white p-8 text-center">
        <p className="text-sm font-semibold text-brand-muted">
          Ödeme bilgileri hazırlanıyor...
        </p>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="rounded-[var(--radius-brand-xl)] border border-brand-border bg-brand-white p-8 text-center md:p-12">
        <h1 className="font-display text-3xl font-bold text-brand-text">
          Sepetiniz boş.
        </h1>

        <p className="mt-4 text-sm leading-7 text-brand-muted md:text-base">
          Checkout adımına geçmeden önce sepetinize ürün eklemelisiniz.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-brand-primary px-6 py-3 font-semibold text-white transition hover:bg-brand-primary-dark"
        >
          Alışverişe Dön
        </Link>
      </section>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-6 lg:grid-cols-[1fr_380px]"
    >
      <section className="space-y-6">
        <div className="rounded-[var(--radius-brand-xl)] border border-brand-border bg-brand-white p-6 md:p-8">
          <p className="font-display text-sm font-bold uppercase tracking-[0.18em] text-brand-primary-dark">
            Müşteri Bilgileri
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Field
              label="Ad"
              value={formState.firstName}
              onChange={(value) => updateField("firstName", value)}
              required
            />

            <Field
              label="Soyad"
              value={formState.lastName}
              onChange={(value) => updateField("lastName", value)}
              required
            />

            <Field
              label="E-posta"
              type="email"
              value={formState.email}
              onChange={(value) => updateField("email", value)}
              required
            />

            <Field
              label="Telefon"
              value={formState.phone}
              onChange={(value) => updateField("phone", value)}
              required
            />
          </div>
        </div>

        <div className="rounded-[var(--radius-brand-xl)] border border-brand-border bg-brand-white p-6 md:p-8">
          <p className="font-display text-sm font-bold uppercase tracking-[0.18em] text-brand-primary-dark">
            Teslimat Adresi
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Field
              label="Ülke"
              value={formState.country}
              onChange={(value) => updateField("country", value)}
              required
            />

            <Field
              label="Şehir"
              value={formState.city}
              onChange={(value) => updateField("city", value)}
              required
            />

            <Field
              label="İlçe"
              value={formState.district}
              onChange={(value) => updateField("district", value)}
              required
            />

            <Field
              label="Mahalle"
              value={formState.neighborhood}
              onChange={(value) => updateField("neighborhood", value)}
            />

            <Field
              label="Posta Kodu"
              value={formState.postalCode}
              onChange={(value) => updateField("postalCode", value)}
            />
          </div>

          <TextAreaField
            label="Açık Adres"
            value={formState.addressLine}
            onChange={(value) => updateField("addressLine", value)}
            required
            minLength={10}
            helperText="Mahalle, cadde/sokak, bina ve daire bilgisi girin. En az 10 karakter olmalıdır."
          />

          <div className="mt-4">
            <TextAreaField
              label="Sipariş Notu"
              value={formState.note}
              onChange={(value) => updateField("note", value)}
            />
          </div>
        </div>

        {errorMessage ? (
          <div className="rounded-[var(--radius-brand-lg)] border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
            {errorMessage}
          </div>
        ) : null}

        {createdOrder ? (
          <div className="rounded-[var(--radius-brand-lg)] border border-brand-accent/40 bg-brand-accent/20 px-5 py-5">
            <p className="font-display text-lg font-bold text-brand-text">
              Taslak sipariş oluşturuldu.
            </p>
            {paytrIframeToken ? (
              <PaytrIframe iframeToken={paytrIframeToken} />
            ) : null}

            <p className="mt-2 text-sm leading-6 text-brand-muted">
              Sipariş numarası:
              <strong className="ml-2 text-brand-text">
                {createdOrder.orderNumber}
              </strong>
            </p>

            <p className="mt-2 text-sm leading-6 text-brand-muted">
              Bir sonraki adımda bu taslak siparişi PayTR ödeme oturumuna
              bağlayacağız.
            </p>
          </div>
        ) : null}
      </section>

      <aside className="h-fit rounded-[var(--radius-brand-xl)] border border-brand-border bg-brand-white p-6 lg:sticky lg:top-28">
        <h2 className="font-display text-2xl font-bold text-brand-text">
          Sipariş Özeti
        </h2>

        <div className="mt-5 space-y-4">
          {items.map((item) => (
            <div
              key={item.variantId}
              className="border-b border-brand-border pb-4 last:border-b-0 last:pb-0"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-brand-text">
                    {item.productName}
                  </p>

                  <p className="mt-1 text-xs text-brand-muted">
                    {item.variantLabel}
                  </p>

                  <p className="mt-1 text-xs text-brand-muted">
                    {item.quantity} adet
                  </p>
                </div>

                <span className="text-sm font-semibold text-brand-text">
                  {formatTRY(item.unitPrice * item.quantity, { decimals: false })}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-3 border-t border-brand-border pt-5 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-brand-muted">Ürün adedi</span>
            <span className="font-semibold text-brand-text">
              {totalItems}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-brand-muted">Ara toplam</span>
            <span className="font-semibold text-brand-text">
              {formatTRY(subtotal, { decimals: false })}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-brand-muted">Kargo</span>
            <span className="font-semibold text-brand-text">
              {shippingFee > 0
                ? formatTRY(shippingFee, { decimals: false })
                : "Ücretsiz"}
            </span>
          </div>

          {freeShippingRemaining > 0 && (
            <p className="rounded-lg bg-brand-secondary px-3 py-2 text-xs text-brand-text">
              {formatTRY(freeShippingRemaining, { decimals: false })} daha ekleyin,
              kargo ücretsiz olsun.
            </p>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <span className="text-base font-semibold text-brand-muted">
            Toplam
          </span>

          <strong className="text-2xl font-bold text-brand-text">
            {formatTRY(total, { decimals: false })}
          </strong>
        </div>

        {/* Sözleşme onayı — KVKK zorunlu */}
        <label className="mt-5 flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={contractAccepted}
            onChange={e => setContractAccepted(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--amber)] cursor-pointer"
            required
          />
          <span className="text-xs leading-relaxed text-brand-muted">
            <a href="/sayfa/mesafeli-satis-sozlesmesi" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-text underline underline-offset-2 hover:text-amber">
              Mesafeli Satış Sözleşmesi
            </a>
            {" "}ve{" "}
            <a href="/sayfa/gizlilik-politikasi" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-text underline underline-offset-2 hover:text-amber">
              KVKK Aydınlatma Metni
            </a>
            &apos;ni okudum, onaylıyorum.
          </span>
        </label>

        <button
          type="submit"
          disabled={isSubmitting || !contractAccepted}
          className="mt-4 w-full rounded-full bg-amber px-6 py-4 font-semibold text-white transition hover:bg-amber-hover disabled:cursor-not-allowed disabled:opacity-50"
          style={{ backgroundColor: contractAccepted ? "var(--amber)" : undefined }}
        >
          {isSubmitting ? "Sipariş Hazırlanıyor..." : "Siparişi Hazırla"}
        </button>
      </aside>
    </form>
  );
}

type FieldProps = {
  label: string;
  type?: string;
  value: string;
  required?: boolean;
  onChange: (value: string) => void;
};

function Field({
  label,
  type = "text",
  value,
  required,
  onChange,
}: FieldProps) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-brand-muted">
        {label}
      </span>

      <input
        type={type}
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-brand-border bg-brand-surface px-4 py-3 text-sm text-brand-text outline-none transition focus:border-brand-primary"
      />
    </label>
  );
}

type TextAreaFieldProps = {
  label: string;
  value: string;
  required?: boolean;
  minLength?: number;
  helperText?: string;
  onChange: (value: string) => void;
};

function TextAreaField({
  label,
  value,
  required,
  minLength,
  helperText,
  onChange,
}: TextAreaFieldProps) {
  const trimmedLength = value.trim().length;

  const hasMinLengthError =
    typeof minLength === "number" &&
    trimmedLength > 0 &&
    trimmedLength < minLength;

  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-brand-muted">
        {label}
      </span>

      <textarea
        value={value}
        required={required}
        minLength={minLength}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className={`w-full resize-none rounded-2xl border bg-brand-surface px-4 py-3 text-sm text-brand-text outline-none transition ${
          hasMinLengthError
            ? "border-red-300 focus:border-red-400"
            : "border-brand-border focus:border-brand-primary"
        }`}
      />

      <div className="flex flex-col gap-1 text-xs">
        {helperText ? (
          <span className="text-brand-muted">{helperText}</span>
        ) : null}

        {typeof minLength === "number" ? (
          <span
            className={
              hasMinLengthError
                ? "font-semibold text-red-600"
                : "text-brand-muted"
            }
          >
            {trimmedLength}/{minLength} karakter
            {hasMinLengthError ? " — minimum karakter sayısına ulaşılmadı." : ""}
          </span>
        ) : null}
      </div>
    </label>
  );
}
