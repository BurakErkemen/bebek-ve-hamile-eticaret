import { createHmac, timingSafeEqual } from "node:crypto";
import type { PaytrConfig } from "@/server/infrastructure/payment/paytr/paytr.config";

type VerifyPaytrCallbackHashInput = {
  merchantOid: string;
  status: string;
  totalAmount: string;
  receivedHash: string;
};

export class PaytrCallbackService {
  constructor(private readonly config: PaytrConfig) {}

  verifyHash(input: VerifyPaytrCallbackHashInput): boolean {
    const tokenRaw =
      input.merchantOid +
      this.config.merchantSalt +
      input.status +
      input.totalAmount;

    const expectedHash = createHmac("sha256", this.config.merchantKey)
      .update(tokenRaw)
      .digest("base64");

    const expectedBuffer = Buffer.from(expectedHash);
    const receivedBuffer = Buffer.from(input.receivedHash);

    if (expectedBuffer.length !== receivedBuffer.length) {
      return false;
    }

    return timingSafeEqual(expectedBuffer, receivedBuffer);
  }
}
