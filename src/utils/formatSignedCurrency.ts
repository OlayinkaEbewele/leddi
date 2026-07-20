import { formatCurrency } from './formatCurrency';

/** Signed currency display — negative values prefixed with minus (patch v0.3 §3). */
export function formatSignedCurrency(amount: number, currency: string): string {
  if (amount < 0) {
    return `− ${formatCurrency(Math.abs(amount), currency)}`;
  }
  return formatCurrency(amount, currency);
}
