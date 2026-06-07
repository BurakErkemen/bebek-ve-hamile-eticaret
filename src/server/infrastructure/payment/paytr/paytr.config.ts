export type PaytrConfig = {
  merchantId: string;
  merchantKey: string;
  merchantSalt: string;
  testMode: string;
  debugOn: string;
  noInstallment: string;
  maxInstallment: string;
  timeoutLimit: string;
  currency: string;
  appUrl: string;
};

function getRequiredEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is not defined.`);
  }

  const placeholderValues = new Set([
    "XXXXXX",
    "YYYYYYYYYYYYYY",
    "ZZZZZZZZZZZZZZ",
    "PAYTR_MAGAZA_NO",
    "PAYTR_MERCHANT_KEY",
    "PAYTR_MERCHANT_SALT",
  ]);

  if (placeholderValues.has(value)) {
    throw new Error(`${name} placeholder değerinde kalmış.`);
  }

  return value;
}

export function getPaytrConfig(): PaytrConfig {
  return {
    merchantId: getRequiredEnv("PAYTR_MERCHANT_ID"),
    merchantKey: getRequiredEnv("PAYTR_MERCHANT_KEY"),
    merchantSalt: getRequiredEnv("PAYTR_MERCHANT_SALT"),
    // Güvenli default: production'da test/debug KAPALI. Açmak için env ile "1" gir.
    testMode: process.env.PAYTR_TEST_MODE?.trim() ?? "0",
    debugOn: process.env.PAYTR_DEBUG_ON?.trim() ?? "0",
    noInstallment: process.env.PAYTR_NO_INSTALLMENT?.trim() ?? "0",
    maxInstallment: process.env.PAYTR_MAX_INSTALLMENT?.trim() ?? "0",
    timeoutLimit: process.env.PAYTR_TIMEOUT_LIMIT?.trim() ?? "30",
    currency: process.env.PAYTR_CURRENCY?.trim() ?? "TL",
    appUrl:
      process.env.NEXT_PUBLIC_APP_URL?.trim() ?? "http://localhost:3000",
  };
}