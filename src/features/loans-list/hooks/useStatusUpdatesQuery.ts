import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { statusUpdatesApi } from '@/api';
import type { StatusUpdatesListQuery } from '@/api/types';

export function usePendingStatusUpdatesQuery(query: StatusUpdatesListQuery) {
  return useQuery({
    queryKey: ['statusUpdates', 'pending', query],
    queryFn: () => statusUpdatesApi.listPendingRequests(query),
    placeholderData: keepPreviousData,
  });
}

export function useStatusAuditTrailQuery(query: StatusUpdatesListQuery) {
  return useQuery({
    queryKey: ['statusUpdates', 'audit', query],
    queryFn: () => statusUpdatesApi.listAuditTrail(query),
    placeholderData: keepPreviousData,
  });
}
