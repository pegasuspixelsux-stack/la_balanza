const priceFormatter = new Intl.NumberFormat("es-UY", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** "790" -> "$ 790" (Uruguayan pesos). */
export function formatPrice(value: number): string {
  return `$ ${priceFormatter.format(value)}`;
}
