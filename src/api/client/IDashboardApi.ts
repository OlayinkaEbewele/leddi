import type { DashboardQuery, DashboardSummary } from '../types';

export interface IDashboardApi {
  getDashboardSummary(query?: DashboardQuery): Promise<DashboardSummary>;
}
