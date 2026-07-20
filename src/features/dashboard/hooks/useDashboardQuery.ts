import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/api';
import type { DashboardQuery } from '@/api/types';

export function useDashboardQuery(query: DashboardQuery) {
  return useQuery({
    queryKey: ['dashboard', query],
    queryFn: () => dashboardApi.getDashboardSummary(query),
  });
}
