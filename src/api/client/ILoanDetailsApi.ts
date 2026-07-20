import type { LoanDetails } from '../types';

export interface ILoanDetailsApi {
  getLoanDetails(acquireId: string): Promise<LoanDetails>;
}
