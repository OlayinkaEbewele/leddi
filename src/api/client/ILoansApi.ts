import type { PaginatedResult, LoanListItem, LoansListQuery } from '../types';

export interface ILoansApi {
  listLoans(query: LoansListQuery): Promise<PaginatedResult<LoanListItem>>;
}
