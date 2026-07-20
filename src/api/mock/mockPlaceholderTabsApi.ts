import type { IPlaceholderTabsApi, PlaceholderTabKey } from '@/api/client/IPlaceholderTabsApi';
import type { PaginatedResult, PlaceholderTabQuery, PlaceholderTabRow } from '@/api/types';
import { initialPlaceholderData } from './fixtures/placeholderTabs.fixtures';
import { withMockNetwork } from './mockNetwork';
import { paginateLoans } from '@/utils/filterLoans';

export const mockPlaceholderTabsApi: IPlaceholderTabsApi = {
  async listPlaceholderRows(
    tab: PlaceholderTabKey,
    query: PlaceholderTabQuery,
  ): Promise<PaginatedResult<PlaceholderTabRow>> {
    return withMockNetwork(() => {
      const rows = [...initialPlaceholderData[tab]];
      if (query.country) {
        void query.country;
      }
      return paginateLoans(rows, query.page, query.pageSize);
    });
  },
};
