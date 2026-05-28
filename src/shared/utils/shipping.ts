export type ShippingConfig = {
  fee: number;
  freeThreshold: number | null;
};

export function calculateShippingFee(
  subtotal: number,
  config: ShippingConfig,
): number {
  if (subtotal <= 0 || config.fee <= 0) {
    return 0;
  }

  if (config.freeThreshold !== null && subtotal >= config.freeThreshold) {
    return 0;
  }

  return config.fee;
}

export function parseShippingConfig(values: {
  fee?: string;
  freeThreshold?: string;
}): ShippingConfig {
  const fee = Number(values.fee ?? "");
  const threshold = Number(values.freeThreshold ?? "");

  return {
    fee: Number.isFinite(fee) && fee > 0 ? fee : 0,
    freeThreshold:
      Number.isFinite(threshold) && threshold > 0 ? threshold : null,
  };
}
