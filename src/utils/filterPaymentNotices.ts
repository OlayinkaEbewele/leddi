import type { PaymentNotice, PaymentNoticesListQuery } from '@/api/types';
import { paginateLoans } from '@/utils/filterLoans';

function matchesSearch(notice: PaymentNotice, query: PaymentNoticesListQuery): boolean {
  const term = query.searchTerm?.trim().toLowerCase();
  if (!term || !query.searchBy) return true;

  switch (query.searchBy) {
    case 'acquireId':
      return notice.acquireId.toLowerCase().includes(term);
    case 'reference':
      return notice.reference.toLowerCase().includes(term);
    case 'customer':
      return notice.customerName.toLowerCase().includes(term);
    case 'email':
      return notice.customerEmail.toLowerCase().includes(term);
    case 'phone':
      return notice.customerPhone.toLowerCase().includes(term);
    default:
      return true;
  }
}

export function filterPaymentNotices(
  notices: PaymentNotice[],
  query: PaymentNoticesListQuery,
): PaymentNotice[] {
  let result = notices.filter((n) => n.allocationStatus === query.allocationStatus);

  if (query.country) {
    result = result.filter((n) => n.country === query.country);
  }
  if (query.product) {
    result = result.filter((n) => n.product === query.product);
  }
  if (query.postingType) {
    result = result.filter((n) => n.type === query.postingType);
  }
  if (query.searchTerm?.trim()) {
    result = result.filter((n) => matchesSearch(n, query));
  }

  const dateRange = query.dateRange;
  if (dateRange?.from) {
    result = result.filter((n) => n.createdAt >= dateRange.from);
  }
  if (dateRange?.to) {
    result = result.filter((n) => n.createdAt <= dateRange.to);
  }

  return result;
}

export function paginateItems<T>(items: T[], page: number, pageSize: number) {
  return paginateLoans(items, page, pageSize);
}
