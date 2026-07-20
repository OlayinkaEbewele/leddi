import { formatCurrency } from '@/utils/formatCurrency';

function currencyPrefix(currencyCode: string): string {
  if (currencyCode === 'NGN') return '₦';
  return `${currencyCode} `;
}

/** Compact portfolio headline — e.g. ₦6.42b / ₦842m */
export function formatCompactCurrency(amount: number, currencyCode: string): string {
  const abs = Math.abs(amount);
  const prefix = currencyPrefix(currencyCode);
  if (abs >= 1_000_000_000) {
    return `${prefix}${(abs / 1_000_000_000).toFixed(2)}b`;
  }
  if (abs >= 1_000_000) {
    const millions = abs / 1_000_000;
    return `${prefix}${millions >= 100 ? Math.round(millions) : millions.toFixed(1)}m`;
  }
  return formatCurrency(amount, currencyCode);
}

export function formatExposureSub(amount: number, currencyCode: string): string {
  return `${formatCompactCurrency(amount, currencyCode)} exposure`;
}

export function formatPromisedSub(amount: number, currencyCode: string): string {
  return `${formatCompactCurrency(amount, currencyCode)} promised`;
}

const COUNTRY_FLAGS: Record<string, string> = {
  NG: '🇳🇬',
  KE: '🇰🇪',
  GH: '🇬🇭',
  UG: '🇺🇬',
};

export function getCountryFlag(country: string): string {
  return COUNTRY_FLAGS[country] ?? '';
}

export type DashboardGreetingPeriod = 'morning' | 'afternoon' | 'evening';

export function getGreetingPeriod(date = new Date()): DashboardGreetingPeriod {
  const hour = date.getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

export type DashboardBucketKey =
  | 'stage3Overdue'
  | 'missedPayment'
  | 'ptpDueToday'
  | 'staleDemandNotice'
  | 'pendingRestructure'
  | 'pendingStatusUpdates';

export function getBucketNavigatePath(bucket: DashboardBucketKey): string {
  switch (bucket) {
    case 'stage3Overdue':
      return '/prime/loans?bucket=stage3Overdue';
    case 'missedPayment':
      return '/prime/loans?bucket=missedPayment';
    case 'ptpDueToday':
      return '/prime/loans?activeTab=ptp';
    case 'staleDemandNotice':
      return '/prime/loans?bucket=staleDemandNotice';
    case 'pendingRestructure':
      return '/prime/loans?activeTab=restructure';
    case 'pendingStatusUpdates':
      return '/prime/loans?activeTab=statusUpdates';
    default:
      return '/prime/loans';
  }
}
