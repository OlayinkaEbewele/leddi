import type { PaginatedResult, PlaceholderTabQuery, PlaceholderTabRow } from '../types';

export type PlaceholderTabKey =
  'PTP' | 'RESTRUCTURE' | 'STATUS_UPDATES' | 'SETTLED_DEALS' | 'DEAL_ADMIN_REQUESTS';

export interface IPlaceholderTabsApi {
  listPlaceholderRows(
    tab: PlaceholderTabKey,
    query: PlaceholderTabQuery,
  ): Promise<PaginatedResult<PlaceholderTabRow>>;
}
