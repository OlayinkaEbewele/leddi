import type { StatusUpdateAuditEntry, StatusUpdateRequest, StatusUpdatesListQuery } from '@/api/types';
import { paginateItems } from '@/utils/filterPaymentNotices';

function matchesAcquireId(acquireId: string, term?: string): boolean {
  if (!term?.trim()) return true;
  return acquireId.toLowerCase().includes(term.trim().toLowerCase());
}

function filterByDate(createdAt: string, dateRange?: { from: string; to: string }): boolean {
  if (dateRange?.from && createdAt < dateRange.from) return false;
  if (dateRange?.to && createdAt > dateRange.to) return false;
  return true;
}

export function filterPendingStatusRequests(
  requests: StatusUpdateRequest[],
  query: StatusUpdatesListQuery,
): StatusUpdateRequest[] {
  return requests.filter(
    (r) =>
      matchesAcquireId(r.acquireId, query.acquireId) &&
      filterByDate(r.requestedAt, query.dateRange),
  );
}

export function filterStatusAuditTrail(
  entries: StatusUpdateAuditEntry[],
  query: StatusUpdatesListQuery,
): StatusUpdateAuditEntry[] {
  return entries.filter(
    (e) =>
      matchesAcquireId(e.acquireId, query.acquireId) &&
      filterByDate(e.actionAt, query.dateRange),
  );
}

export function paginateStatusUpdates<T>(items: T[], page: number, pageSize: number) {
  return paginateItems(items, page, pageSize);
}
