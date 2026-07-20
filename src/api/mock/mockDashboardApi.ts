import type { IDashboardApi } from '@/api/client/IDashboardApi';
import type { DashboardQuery, DashboardSummary } from '@/api/types';
import { buildMockDashboardSummary } from './fixtures/dashboard.fixtures';
import { withMockNetwork } from './mockNetwork';

export const mockDashboardApi: IDashboardApi = {
  async getDashboardSummary(query?: DashboardQuery): Promise<DashboardSummary> {
    return withMockNetwork(() => buildMockDashboardSummary(query?.country));
  },
};
