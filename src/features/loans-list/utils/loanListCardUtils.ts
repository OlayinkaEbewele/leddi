import type { LoanListItem } from '@/api/types';
import { DASHBOARD_BUCKET_TONES } from '@/features/dashboard/dashboardTheme';

export function getLoanCardStripeColor(loan: LoanListItem): string {
  if (loan.ifrsStatus !== null && loan.ifrsStatus >= 3) {
    return DASHBOARD_BUCKET_TONES.critical.stripe;
  }
  const status = loan.operationalStatus.status;
  if (status === 'DEFAULTED' || status === 'IN_RECOVERY') {
    return DASHBOARD_BUCKET_TONES.critical.stripe;
  }
  if (status === 'DELINQUENT' || status === 'MISSEDPAYMENT') {
    return DASHBOARD_BUCKET_TONES.warning.stripe;
  }
  if (loan.ifrsStatus === 2) {
    return DASHBOARD_BUCKET_TONES.info.stripe;
  }
  return '#4A7C59';
}

export function showNplBadge(loan: LoanListItem): boolean {
  return loan.ifrsStatus !== null && loan.ifrsStatus >= 3;
}
