export function formatCurrency(value: number) {
  return new Intl.NumberFormat("fa-IR").format(value);
}
