import type { GlobalFiltersState } from '@/features/loans-list/types/filters';
import type { LoansLocalFiltersState } from '@/features/loans-list/types/filters';
import { EMPTY_IFRS_FILTER } from '@/utils/ifrsFilter';
import { PRIME_TAB_KEYS, type PrimeTabKey } from '@/features/loans-list/components/PrimeTabStrip';

export function resolveTabFromSearchParam(activeTab: string | null): number {
  if (!activeTab) return 0;
  const idx = PRIME_TAB_KEYS.indexOf(activeTab as PrimeTabKey);
  return idx >= 0 ? idx : 0;
}

export function applyDashboardBucketParams(
  bucket: string | null,
  globalFilters: GlobalFiltersState,
  localFilters: LoansLocalFiltersState,
): { globalFilters: GlobalFiltersState; localFilters: LoansLocalFiltersState } {
  if (!bucket) {
    return { globalFilters, localFilters };
  }

  switch (bucket) {
    case 'stage3Overdue':
      return {
        globalFilters,
        localFilters: {
          ...localFilters,
          ifrsFilter: {
            ...EMPTY_IFRS_FILTER,
            quickFilter: 'freeSelection',
            threePlus: true,
          },
        },
      };
    case 'missedPayment':
      return {
        globalFilters: { ...globalFilters, statuses: ['MISSEDPAYMENT'] },
        localFilters,
      };
    case 'staleDemandNotice':
      return {
        globalFilters,
        localFilters: { ...localFilters, demandNoticeFilter: 'expired' },
      };
    default:
      return { globalFilters, localFilters };
  }
}
