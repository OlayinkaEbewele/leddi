import type { LoanListItem } from '@/api/types';

export type IfrsQuickFilter = 'all' | 'excludeCurrent' | 'currentOnly' | 'freeSelection';

export interface IfrsFilterState {
  quickFilter: IfrsQuickFilter;
  onePlus: boolean;
  twoPlus: boolean;
  threePlus: boolean;
  currentOnly: boolean;
}

export const EMPTY_IFRS_FILTER: IfrsFilterState = {
  quickFilter: 'all',
  onePlus: false,
  twoPlus: false,
  threePlus: false,
  currentOnly: false,
};

/** IFRS stage 0 = current / performing loan in production filter semantics. */
function isCurrentLoan(ifrsStatus: number | null): boolean {
  return ifrsStatus === 0;
}

function matchesFreeSelection(loan: LoanListItem, filter: IfrsFilterState): boolean {
  const { ifrsStatus } = loan;
  const checks: boolean[] = [];

  if (filter.onePlus) {
    checks.push(ifrsStatus !== null && ifrsStatus >= 1);
  }
  if (filter.twoPlus) {
    checks.push(ifrsStatus !== null && ifrsStatus >= 2);
  }
  if (filter.threePlus) {
    checks.push(ifrsStatus !== null && ifrsStatus >= 3);
  }
  if (filter.currentOnly) {
    checks.push(isCurrentLoan(ifrsStatus));
  }

  if (checks.length === 0) {
    return true;
  }

  return checks.some(Boolean);
}

export function matchesIfrsFilter(loan: LoanListItem, filter: IfrsFilterState): boolean {
  switch (filter.quickFilter) {
    case 'all':
      return true;
    case 'excludeCurrent':
      return !isCurrentLoan(loan.ifrsStatus);
    case 'currentOnly':
      return isCurrentLoan(loan.ifrsStatus);
    case 'freeSelection':
      return matchesFreeSelection(loan, filter);
    default:
      return true;
  }
}

export function isIfrsFilterActive(filter: IfrsFilterState): boolean {
  if (filter.quickFilter === 'all') {
    return false;
  }
  if (filter.quickFilter === 'freeSelection') {
    return filter.onePlus || filter.twoPlus || filter.threePlus || filter.currentOnly;
  }
  return true;
}
