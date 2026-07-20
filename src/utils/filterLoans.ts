import type { LoanListItem, LoansListQuery } from '@/api/types';
import { isIfrsFilterActive, matchesIfrsFilter } from '@/utils/ifrsFilter';

function applyGlobalFilters(loans: LoanListItem[], query: LoansListQuery): LoanListItem[] {
  let result = loans;

  if (query.country) {
    result = result.filter((loan) => loan.country === query.country);
  }
  if (query.classification) {
    result = result.filter((loan) => loan.classification === query.classification);
  }
  if (query.structureCode) {
    result = result.filter((loan) => loan.structureCode === query.structureCode);
  }
  if (query.loanCategory) {
    result = result.filter((loan) => loan.loanCategory === query.loanCategory);
  }
  if (query.statuses && query.statuses.length > 0) {
    const statuses = query.statuses;
    result = result.filter((loan) => statuses.includes(loan.operationalStatus.status));
  }
  const dateRange = query.dateRange;
  if (dateRange?.from) {
    result = result.filter((loan) => loan.inceptionDate >= dateRange.from);
  }
  if (dateRange?.to) {
    result = result.filter((loan) => loan.inceptionDate <= dateRange.to);
  }

  return result;
}

function matchesSearch(loan: LoanListItem, term: string, searchBy: NonNullable<LoansListQuery['searchBy']>): boolean {
  const normalized = term.toLowerCase();
  switch (searchBy) {
    case 'loanId':
      return (
        loan.acquireId.toLowerCase().includes(normalized) ||
        loan.loandiskId.toLowerCase().includes(normalized)
      );
    case 'customer':
      return loan.customerName.toLowerCase().includes(normalized);
    case 'vin':
      return loan.vin.toLowerCase().includes(normalized);
    case 'carId':
      return loan.carId.toLowerCase().includes(normalized);
    case 'email':
      return loan.customerEmail.toLowerCase().includes(normalized);
    default:
      return false;
  }
}

export function filterLoans(loans: LoanListItem[], query: LoansListQuery): LoanListItem[] {
  let result = applyGlobalFilters(loans, query);

  if (query.searchTerm?.trim()) {
    const term = query.searchTerm.trim();
    const searchBy = query.searchBy ?? 'loanId';
    result = result.filter((loan) => matchesSearch(loan, term, searchBy));
  }

  if (query.ifrsFilter && isIfrsFilterActive(query.ifrsFilter)) {
    result = result.filter((loan) => matchesIfrsFilter(loan, query.ifrsFilter!));
  }

  if (query.demandNoticeFilter === 'valid') {
    result = result.filter((loan) => loan.demandNoticeDate && !loan.isDemandNoticeStale);
  } else if (query.demandNoticeFilter === 'expired') {
    result = result.filter((loan) => loan.demandNoticeDate && loan.isDemandNoticeStale);
  } else if (query.demandNoticeFilter === 'without') {
    result = result.filter((loan) => !loan.demandNoticeDate);
  }

  return result;
}

export function paginateLoans<T>(
  items: T[],
  page: number,
  pageSize: number,
): { items: T[]; totalCount: number; page: number; pageSize: number } {
  const totalCount = items.length;
  const start = (page - 1) * pageSize;
  const pageItems = items.slice(start, start + pageSize);
  return { items: pageItems, totalCount, page, pageSize };
}
