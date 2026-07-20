import type {
  CustomerDetails,
  LoanNote,
  PromiseToPay,
  RecoveryStatus,
  RestructureRequestPayload,
} from '../types';

export interface ILoanActionsApi {
  addNote(
    acquireId: string,
    note: Pick<LoanNote, 'type' | 'content' | 'channel' | 'appSource'>,
  ): Promise<LoanNote>;
  addPtp(
    acquireId: string,
    ptp: Pick<PromiseToPay, 'amount' | 'promisedDate'>,
  ): Promise<PromiseToPay>;
  requestStatusUpdate(acquireId: string, newStatus: string, reason: string): Promise<void>;
  requestAssetRecovery(acquireId: string, reason: string): Promise<RecoveryStatus>;
  cancelAssetRecovery(acquireId: string): Promise<void>;
  requestRestructure(acquireId: string, payload: RestructureRequestPayload): Promise<void>;
  generateStatement(
    acquireId: string,
    dateRange: { from: string; to: string },
  ): Promise<{ mocked: true }>;
  generateSettlementQuote(acquireId: string): Promise<{ mocked: true }>;
  generateTerminationLetter(acquireId: string): Promise<{ mocked: true }>;
  updateCustomerContact(
    acquireId: string,
    contact: { phone?: string; email?: string },
  ): Promise<CustomerDetails>;
  addAlternativePhoneNumber(
    acquireId: string,
    entry: { number: string; label?: string },
  ): Promise<CustomerDetails>;
  deleteAlternativePhoneNumber(acquireId: string, number: string): Promise<CustomerDetails>;
  addAlternativeEmail(acquireId: string, email: string): Promise<CustomerDetails>;
  addAlternativeAddress(acquireId: string, address: string): Promise<CustomerDetails>;
}
