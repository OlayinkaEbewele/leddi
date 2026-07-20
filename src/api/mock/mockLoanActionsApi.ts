import { faker } from '@faker-js/faker';
import type { ILoanActionsApi } from '@/api/client/ILoanActionsApi';
import type { LoanNote, PromiseToPay } from '@/api/types';
import {
  addAlternativeAddress,
  addAlternativeEmail,
  addAlternativePhoneNumber,
  appendNote,
  appendPtp,
  appendStatusUpdateNote,
  deleteAlternativePhoneNumber,
  getLoanDetails,
  setRecovery,
  setSettlementQuote,
  updateCustomerContact,
  updateLoanListItem,
} from './fixtures/loanDetails.fixtures';
import { withMockNetworkForAcquireId } from './mockNetwork';

const MOCK_USER = 'Collections Officer (Mock)';

function requireLoan(acquireId: string) {
  const loan = getLoanDetails(acquireId);
  if (!loan) throw new Error(`Loan not found: ${acquireId}`);
  return loan;
}

export const mockLoanActionsApi: ILoanActionsApi = {
  async addNote(acquireId, noteInput) {
    return withMockNetworkForAcquireId(acquireId, () => {
      requireLoan(acquireId);
      const note: LoanNote = {
        id: faker.string.uuid(),
        type: noteInput.type,
        content: noteInput.content,
        channel: noteInput.channel,
        appSource: noteInput.appSource,
        createdBy: MOCK_USER,
        createdAt: new Date().toISOString(),
      };
      appendNote(acquireId, note);
      return note;
    });
  },

  async addPtp(acquireId, ptpInput) {
    return withMockNetworkForAcquireId(acquireId, () => {
      requireLoan(acquireId);
      const now = new Date().toISOString();
      const ptp: PromiseToPay = {
        id: faker.string.uuid(),
        capturedBy: MOCK_USER,
        amount: ptpInput.amount,
        promisedDate: ptpInput.promisedDate,
        status: 'PENDING',
        statusTime: now,
        createdAt: now,
      };
      appendPtp(acquireId, ptp);
      return ptp;
    });
  },

  async requestStatusUpdate(acquireId, newStatus, reason) {
    return withMockNetworkForAcquireId(acquireId, () => {
      requireLoan(acquireId);
      const note: LoanNote = {
        id: faker.string.uuid(),
        type: 'STATUS_UPDATE',
        content: `<p>Status update requested: ${newStatus}. Reason: ${reason}</p>`,
        channel: 'INTERNAL',
        appSource: 'PRIME',
        createdBy: MOCK_USER,
        createdAt: new Date().toISOString(),
      };
      appendStatusUpdateNote(acquireId, note, newStatus);
    });
  },

  async requestAssetRecovery(acquireId, reason) {
    return withMockNetworkForAcquireId(acquireId, () => {
      const loan = requireLoan(acquireId);
      const eligible = ['DEFAULTED', 'DELINQUENT', 'IN_RECOVERY', 'MISSEDPAYMENT'].includes(
        loan.operationalStatus.status,
      );
      if (!eligible) {
        throw new Error('CHECK_REPOSSESSION');
      }
      const recovery = {
        requestedAt: new Date().toISOString(),
        requestedBy: 'Collections Officer',
        status: 'REQUESTED' as const,
        reason,
      };
      setRecovery(acquireId, recovery);
      updateLoanListItem(acquireId, {
        operationalStatus: {
          status: 'IN_RECOVERY',
          asOfDate: new Date().toISOString().split('T')[0],
        },
      });
      return recovery;
    });
  },

  async cancelAssetRecovery(acquireId) {
    return withMockNetworkForAcquireId(acquireId, () => {
      requireLoan(acquireId);
      setRecovery(acquireId, {
        requestedAt: new Date().toISOString(),
        requestedBy: 'Collections Officer',
        status: 'CANCELLED',
        reason: 'Revocation requested',
        cancelledAt: new Date().toISOString(),
      });
    });
  },

  async requestRestructure(acquireId, payload) {
    return withMockNetworkForAcquireId(acquireId, () => {
      requireLoan(acquireId);
      const note: LoanNote = {
        id: faker.string.uuid(),
        type: 'GENERAL',
        content: `<p>Restructure requested: ${payload.reason}. Proposed terms: ${payload.proposedTerms}</p>`,
        channel: 'INTERNAL',
        appSource: 'PRIME',
        createdBy: MOCK_USER,
        createdAt: new Date().toISOString(),
      };
      appendNote(acquireId, note);
    });
  },

  async generateStatement(acquireId, dateRange) {
    return withMockNetworkForAcquireId(acquireId, () => {
      requireLoan(acquireId);
      void dateRange;
      return { mocked: true as const };
    });
  },

  async generateSettlementQuote(acquireId) {
    return withMockNetworkForAcquireId(acquireId, () => {
      const loan = requireLoan(acquireId);
      const quote = {
        id: faker.string.uuid(),
        amount: Math.round(loan.totalExposure * 0.85 * 100) / 100,
        generatedAt: new Date().toISOString(),
        status: 'DRAFT',
      };
      setSettlementQuote(acquireId, quote);
      return { mocked: true as const };
    });
  },

  async generateTerminationLetter(acquireId) {
    return withMockNetworkForAcquireId(acquireId, () => {
      const loan = requireLoan(acquireId);
      if (loan.country !== 'NG') {
        throw new Error('TERMINATION_LETTER_NOT_AVAILABLE');
      }
      return { mocked: true as const };
    });
  },

  async updateCustomerContact(acquireId, contact) {
    return withMockNetworkForAcquireId(acquireId, () => {
      requireLoan(acquireId);
      const updated = updateCustomerContact(acquireId, contact);
      if (!updated) throw new Error(`Loan not found: ${acquireId}`);
      return updated;
    });
  },

  async addAlternativePhoneNumber(acquireId, entry) {
    return withMockNetworkForAcquireId(acquireId, () => {
      requireLoan(acquireId);
      const updated = addAlternativePhoneNumber(acquireId, entry);
      if (!updated) throw new Error(`Loan not found: ${acquireId}`);
      return updated;
    });
  },

  async deleteAlternativePhoneNumber(acquireId, number) {
    return withMockNetworkForAcquireId(acquireId, () => {
      requireLoan(acquireId);
      const updated = deleteAlternativePhoneNumber(acquireId, number);
      if (!updated) throw new Error(`Loan not found: ${acquireId}`);
      return updated;
    });
  },

  async addAlternativeEmail(acquireId, email) {
    return withMockNetworkForAcquireId(acquireId, () => {
      requireLoan(acquireId);
      const updated = addAlternativeEmail(acquireId, email);
      if (!updated) throw new Error(`Loan not found: ${acquireId}`);
      return updated;
    });
  },

  async addAlternativeAddress(acquireId, address) {
    return withMockNetworkForAcquireId(acquireId, () => {
      requireLoan(acquireId);
      const updated = addAlternativeAddress(acquireId, address);
      if (!updated) throw new Error(`Loan not found: ${acquireId}`);
      return updated;
    });
  },
};
