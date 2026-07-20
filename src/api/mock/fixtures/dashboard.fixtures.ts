import type {
  DashboardSummary,
  DashboardWorklistItem,
  LoanDetails,
  LoanListItem,
} from '@/api/types';
import { formatCurrency } from '@/utils/formatCurrency';
import { getLoanDetailsMap, getLoanListItems } from './loanDetails.fixtures';

const MOCK_COLLECTION_RATE = 91.4;

// TODO(real): replace with real aggregation query
const MOCK_BUCKET_OVERRIDES = {
  stage3Overdue: { count: 47, exposure: 512_000_000 },
  missedPayment: { count: 128, exposure: 1_200_000_000 },
  ptpDueToday: { count: 19, totalPromised: 88_000_000 },
  staleDemandNotice: { count: 34 },
  pendingRestructure: { count: 12 },
  pendingStatusUpdates: { count: 23 },
};

const MOCK_SUMMARY_OVERRIDES = {
  totalActiveLoans: 1284,
  totalExposure: 6_420_000_000,
  totalArrears: 842_000_000,
  collectionRate: MOCK_COLLECTION_RATE,
};

const MOCK_TRENDS: DashboardSummary['trends'] = {
  totalActiveLoans: { deltaPercent: 2.1, direction: 'up', sentiment: 'positive' },
  totalArrears: { deltaPercent: 4.8, direction: 'up', sentiment: 'negative' },
  collectionRate: { deltaPercent: 0.6, direction: 'down', sentiment: 'warning' },
};

function todayIso(): string {
  return new Date().toISOString().split('T')[0]!;
}

function filterByCountry(loans: LoanListItem[], country?: string): LoanListItem[] {
  if (!country) return loans;
  return loans.filter((loan) => loan.country === country);
}

function isStage3Overdue(loan: LoanListItem, details?: LoanDetails): boolean {
  // TODO(confirm): exact Stage 3 / overdue bucket definition
  const daysInArrears = details?.repaymentInfo.daysInArrears ?? 0;
  return (loan.ifrsStatus !== null && loan.ifrsStatus >= 3) || daysInArrears > 60;
}

function buildWorklist(
  loans: LoanListItem[],
  detailsMap: Map<string, LoanDetails>,
): DashboardWorklistItem[] {
  const today = todayIso();
  const candidates: Array<DashboardWorklistItem & { sortKey: number }> = [];

  for (const loan of loans) {
    const details = detailsMap.get(loan.acquireId);
    const daysInArrears = details?.repaymentInfo.daysInArrears ?? 0;

    if (isStage3Overdue(loan, details)) {
      candidates.push({
        loan,
        reason: 'stage3Overdue',
        priorityTier: 'critical',
        reasonLabel: `Stage 3 • ${daysInArrears} days overdue`,
        metaDetail: `${daysInArrears} days overdue`,
        sortKey: 1000 - daysInArrears,
      });
      continue;
    }

    if (loan.operationalStatus.status === 'MISSEDPAYMENT') {
      candidates.push({
        loan,
        reason: 'missedPayment',
        priorityTier: 'warning',
        reasonLabel: 'Missed payment',
        metaDetail: formatCurrency(Math.abs(loan.arrearsBalance), loan.currency),
        sortKey: 2000 + Math.abs(loan.arrearsBalance),
      });
      continue;
    }

    const ptpToday = details?.ptps.find(
      (ptp) => ptp.status === 'PENDING' && ptp.promisedDate === today,
    );
    if (ptpToday) {
      candidates.push({
        loan,
        reason: 'ptpDueToday',
        priorityTier: 'warning',
        reasonLabel: 'PTP due today',
        metaDetail: formatCurrency(ptpToday.amount, loan.currency),
        sortKey: 3000,
      });
      continue;
    }

    if (loan.isDemandNoticeStale) {
      candidates.push({
        loan,
        reason: 'staleNotice',
        priorityTier: 'warning',
        reasonLabel: 'Stale notice',
        metaDetail: formatCurrency(Math.abs(loan.arrearsBalance), loan.currency),
        sortKey: 4000,
      });
    }
  }

  candidates.sort((a, b) => a.sortKey - b.sortKey);

  return candidates.slice(0, 5).map(({ sortKey: _sortKey, ...item }) => item);
}

export function buildMockDashboardSummary(country?: string): DashboardSummary {
  const allLoans = getLoanListItems();
  const loans = filterByCountry(allLoans, country);
  const detailsMap = getLoanDetailsMap();
  const scopeLabel = country ?? 'all countries';

  const primaryCurrency = loans[0]?.currency ?? 'NGN';

  return {
    totalActiveLoans: MOCK_SUMMARY_OVERRIDES.totalActiveLoans,
    totalExposure: MOCK_SUMMARY_OVERRIDES.totalExposure,
    totalArrears: MOCK_SUMMARY_OVERRIDES.totalArrears,
    collectionRate: MOCK_SUMMARY_OVERRIDES.collectionRate,
    currency: primaryCurrency,
    scopeLabel,
    trends: MOCK_TRENDS,
    buckets: {
      stage3Overdue: {
        count: MOCK_BUCKET_OVERRIDES.stage3Overdue.count,
        exposure: MOCK_BUCKET_OVERRIDES.stage3Overdue.exposure,
      },
      missedPayment: {
        count: MOCK_BUCKET_OVERRIDES.missedPayment.count,
        exposure: MOCK_BUCKET_OVERRIDES.missedPayment.exposure,
      },
      ptpDueToday: {
        count: MOCK_BUCKET_OVERRIDES.ptpDueToday.count,
        totalPromised: MOCK_BUCKET_OVERRIDES.ptpDueToday.totalPromised,
      },
      staleDemandNotice: {
        count: MOCK_BUCKET_OVERRIDES.staleDemandNotice.count,
      },
      pendingRestructure: {
        count: MOCK_BUCKET_OVERRIDES.pendingRestructure.count,
      },
      pendingStatusUpdates: {
        count: MOCK_BUCKET_OVERRIDES.pendingStatusUpdates.count,
      },
    },
    topPriorityLoans: buildWorklist(loans, detailsMap),
    totalLoanCount: MOCK_SUMMARY_OVERRIDES.totalActiveLoans,
  };
}

/** Pre-baked export for tests / direct fixture access. */
export const mockDashboardSummary = buildMockDashboardSummary();
