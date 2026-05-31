import { createHmac } from "node:crypto";
import type { PaytrConfig } from "@/server/infrastructure/payment/paytr/paytr.config";

type PaytrBasketItem = {
  name: string;
  unitPrice: number;
  quantity: number;
};

type CreatePaytrIframeTokenInput = {
  merchantOid: string;
  userIp: string;
  email: string;
  paymentAmount: number;
  userName: string;
  userAddress: string;
  userPhone: string;
  basketItems: PaytrBasketItem[];
};

type PaytrTokenSuccessResponse = {
  status: "success";
  token: string;
};

type PaytrTokenFailedResponse = {
  status: "failed";
  reason?: string;
};

type PaytrTokenResponse =
  | PaytrTokenSuccessResponse
  | PaytrTokenFailedResponse;

function toPaytrAmount(amount: number): string {
  return Math.round(amount * 100).toString();
}

function createUserBasket(items: PaytrBasketItem[]): string {
  const basket = items.map((item) => [
    item.name,
    item.unitPrice.toFixed(2),
    item.quantity,
  ]);

  return Buffer.from(JSON.stringify(basket), "utf8").toString("base64");
}

function createPaytrToken(input: {
  config: PaytrConfig;
  userIp: string;
  merchantOid: string;
  email: string;
  paymentAmount: string;
  userBasket: string;
}) {
  const hashString = [
    input.config.merchantId,
    input.userIp,
    input.merchantOid,
    input.email,
    input.paymentAmount,
    input.userBasket,
    input.config.noInstallment,
    input.config.maxInstallment,
    input.config.currency,
    input.config.testMode,
  ].join("");

  const tokenRaw = `${hashString}${input.config.merchantSalt}`;

  return createHmac("sha256", input.config.merchantKey)
    .update(tokenRaw)
    .digest("base64");
}

export class PaytrIframeService {
  constructor(private readonly config: PaytrConfig) {}

  async createIframeToken(
    input: CreatePaytrIframeTokenInput,
  ): Promise<string> {
    const paymentAmount = toPaytrAmount(input.paymentAmount);
    const userBasket = createUserBasket(input.basketItems);

    const paytrToken = createPaytrToken({
      config: this.config,
      userIp: input.userIp,
      merchantOid: input.merchantOid,
      email: input.email,
      paymentAmount,
      userBasket,
    });

    const merchantOkUrl = `${this.config.appUrl}/odeme/basarili?merchant_oid=${input.merchantOid}`;
    const merchantFailUrl = `${this.config.appUrl}/odeme/basarisiz?merchant_oid=${input.merchantOid}`;

    const formData = new URLSearchParams({
      merchant_id: this.config.merchantId,
      user_ip: input.userIp,
      merchant_oid: input.merchantOid,
      email: input.email,
      payment_amount: paymentAmount,
      paytr_token: paytrToken,
      user_basket: userBasket,
      debug_on: this.config.debugOn,
      no_installment: this.config.noInstallment,
      max_installment: this.config.maxInstallment,
      user_name: input.userName,
      user_address: input.userAddress,
      user_phone: input.userPhone,
      merchant_ok_url: merchantOkUrl,
      merchant_fail_url: merchantFailUrl,
      timeout_limit: this.config.timeoutLimit,
      currency: this.config.currency,
      test_mode: this.config.testMode,
      lang: "tr",
      iframe_v2: "1",
    });

    if (process.env.PAYTR_DEBUG === "1") {
      console.info("PayTR get-token request debug:", {
        merchant_id: this.config.merchantId,
        user_ip: input.userIp,
        merchant_oid: input.merchantOid,
        email: input.email,
        payment_amount: paymentAmount,
        currency: this.config.currency,
        test_mode: this.config.testMode,
        no_installment: this.config.noInstallment,
        max_installment: this.config.maxInstallment,
        timeout_limit: this.config.timeoutLimit,
        app_url: this.config.appUrl,
        basket_item_count: input.basketItems.length,
      });
    }

    const response = await fetch("https://www.paytr.com/odeme/api/get-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    const result = (await response.json()) as PaytrTokenResponse;

    if (result.status !== "success") {
      throw new Error(
        result.reason ?? "PayTR token isteği başarısız oldu.",
      );
    }

    return result.token;
  }
}
