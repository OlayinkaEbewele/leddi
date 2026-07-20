import type { ChipTone } from '@/theme/theme';

/** Maps operational status labels to semantic chip tones from theme. */
export function getStatusChipTone(status: string): ChipTone {
  const normalized = status.toUpperCase().replace(/\s+/g, '_');

  if (['PERFORMING', 'ACTIVE'].includes(normalized)) return 'riskStage1';
  if (['WATCHLIST', 'DELINQUENT', 'MISSEDPAYMENT'].includes(normalized)) {
    return 'riskStage2';
  }
  if (['LITIGATION', 'DEFAULTED', 'IN_RECOVERY', 'NPL'].includes(normalized)) {
    return 'riskStage3';
  }
  if (['RESTRUCTURED'].includes(normalized)) return 'positive';
  return 'neutral';
}
