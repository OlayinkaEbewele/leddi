import type { ILoanDetailsApi } from '@/api/client/ILoanDetailsApi';
import { getLoanDetails } from './fixtures/loanDetails.fixtures';
import { withMockNetworkForAcquireId } from './mockNetwork';

export const mockLoanDetailsApi: ILoanDetailsApi = {
  async getLoanDetails(acquireId: string) {
    return withMockNetworkForAcquireId(acquireId, () => {
      const details = getLoanDetails(acquireId);
      if (!details) {
        throw new Error(`Loan not found: ${acquireId}`);
      }
      return details;
    });
  },
};
