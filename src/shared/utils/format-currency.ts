const formatterWithDecimals = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
});

const formatterNoDecimals = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 0,
});

/**
 * Tutarları Türk Lirası formatında gösterir.
 * @param amount Biçimlendirilecek tutar
 * @param options.decimals Kuruş gösterilsin mi (varsayılan: true)
 */
export function formatTRY(
  amount: number,
  options?: { decimals?: boolean },
): string {
  const formatter =
    options?.decimals === false ? formatterNoDecimals : formatterWithDecimals;
  return formatter.format(amount);
}
