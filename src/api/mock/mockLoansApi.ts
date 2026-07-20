import type { ILoansApi } from '@/api/client/ILoansApi';
import type { PaginatedResult, LoanListItem, LoansListQuery } from '@/api/types';
import { filterLoans, paginateLoans } from '@/utils/filterLoans';
import { getLoanListItems } from './fixtures/loanDetails.fixtures';
import { withMockNetwork } from './mockNetwork';

export const mockLoansApi: ILoansApi = {
  async listLoans(query: LoansListQuery): Promise<PaginatedResult<LoanListItem>> {
    return withMockNetwork(() => {
      const filtered = filterLoans(getLoanListItems(), query);
      return paginateLoans(filtered, query.page, query.pageSize);
    });
  },
};
