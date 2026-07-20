/**
 * In-memory mutation store for mock API actions.
 * Mutations persist within a browser session but reset on full page reload. PRD §7.4
 */
import type {
  CustomerDetails,
  LoanDetails,
  LoanListItem,
  LoanNote,
  OperationalStatus,
  PromiseToPay,
  RecoveryStatus,
  SettlementQuote,
} from '@/api/types';
import { getInitialLoanDetailsMap, getInitialLoanListItems } from './loans.fixtures';

let loanListItems: LoanListItem[] | null = null;
let loanDetailsMap: Map<string, LoanDetails> | null = null;

function ensureStoreInitialized(): void {
  if (loanListItems && loanDetailsMap) return;
  loanListItems = [...getInitialLoanListItems()];
  loanDetailsMap = new Map(getInitialLoanDetailsMap());
}

export function getLoanListItems(): LoanListItem[] {
  ensureStoreInitialized();
  return loanListItems!;
}

export function getLoanDetailsMap(): Map<string, LoanDetails> {
  ensureStoreInitialized();
  return loanDetailsMap!;
}

export function getLoanDetails(acquireId: string): LoanDetails | undefined {
  ensureStoreInitialized();
  return loanDetailsMap!.get(acquireId);
}

export function updateLoanListItem(acquireId: string, patch: Partial<LoanListItem>): void {
  ensureStoreInitialized();
  loanListItems = loanListItems!.map((item) =>
    item.acquireId === acquireId ? { ...item, ...patch } : item,
  );
  const details = loanDetailsMap!.get(acquireId);
  if (details) {
    loanDetailsMap!.set(acquireId, { ...details, ...patch });
  }
}

export function updateCustomerContact(
  acquireId: string,
  contact: { phone?: string; email?: string },
): CustomerDetails | undefined {
  ensureStoreInitialized();
  const details = loanDetailsMap!.get(acquireId);
  if (!details) return undefined;

  const customer: CustomerDetails = {
    ...details.customer,
    ...(contact.phone !== undefined ? { phone: contact.phone } : {}),
    ...(contact.email !== undefined ? { email: contact.email } : {}),
  };

  const patch: Partial<LoanListItem> = {};
  if (contact.email !== undefined) {
    patch.customerEmail = contact.email;
  }

  loanDetailsMap!.set(acquireId, { ...details, customer, ...patch });
  if (Object.keys(patch).length > 0) {
    updateLoanListItem(acquireId, patch);
  }

  return customer;
}

export function appendNote(acquireId: string, note: LoanNote): void {
  ensureStoreInitialized();
  const details = loanDetailsMap!.get(acquireId);
  if (!details) return;
  loanDetailsMap!.set(acquireId, {
    ...details,
    notes: [note, ...details.notes],
  });
}

export function appendPtp(acquireId: string, ptp: PromiseToPay): void {
  ensureStoreInitialized();
  const details = loanDetailsMap!.get(acquireId);
  if (!details) return;
  loanDetailsMap!.set(acquireId, {
    ...details,
    ptps: [ptp, ...details.ptps],
  });
}

export function setRecovery(acquireId: string, recovery: RecoveryStatus | null): void {
  ensureStoreInitialized();
  const details = loanDetailsMap!.get(acquireId);
  if (!details) return;
  loanDetailsMap!.set(acquireId, { ...details, recovery });
}

export function appendStatusUpdateNote(acquireId: string, note: LoanNote, newStatus: string): void {
  ensureStoreInitialized();
  const details = loanDetailsMap!.get(acquireId);
  const asOfDate = new Date().toISOString().split('T')[0];
  const operationalStatus: OperationalStatus = { status: newStatus, asOfDate };
  updateLoanListItem(acquireId, { operationalStatus });
  if (details) {
    loanDetailsMap!.set(acquireId, { ...details, operationalStatus });
  }
  appendNote(acquireId, note);
}

export function setSettlementQuote(acquireId: string, quote: SettlementQuote): void {
  ensureStoreInitialized();
  const details = loanDetailsMap!.get(acquireId);
  if (!details) return;
  loanDetailsMap!.set(acquireId, { ...details, settlementQuote: quote });
}

function patchCustomer(acquireId: string, customer: CustomerDetails): CustomerDetails {
  ensureStoreInitialized();
  const details = loanDetailsMap!.get(acquireId);
  if (!details) return customer;
  loanDetailsMap!.set(acquireId, { ...details, customer });
  return customer;
}

export function addAlternativePhoneNumber(
  acquireId: string,
  entry: { number: string; label?: string },
): CustomerDetails | undefined {
  ensureStoreInitialized();
  const details = loanDetailsMap!.get(acquireId);
  if (!details) return undefined;
  const customer: CustomerDetails = {
    ...details.customer,
    alternativePhoneNumbers: [...details.customer.alternativePhoneNumbers, entry],
  };
  return patchCustomer(acquireId, customer);
}

export function deleteAlternativePhoneNumber(
  acquireId: string,
  number: string,
): CustomerDetails | undefined {
  ensureStoreInitialized();
  const details = loanDetailsMap!.get(acquireId);
  if (!details) return undefined;
  const customer: CustomerDetails = {
    ...details.customer,
    alternativePhoneNumbers: details.customer.alternativePhoneNumbers.filter(
      (p) => p.number !== number,
    ),
  };
  return patchCustomer(acquireId, customer);
}

export function addAlternativeEmail(acquireId: string, email: string): CustomerDetails | undefined {
  ensureStoreInitialized();
  const details = loanDetailsMap!.get(acquireId);
  if (!details) return undefined;
  const customer: CustomerDetails = {
    ...details.customer,
    alternativeEmails: [...details.customer.alternativeEmails, email],
  };
  return patchCustomer(acquireId, customer);
}

export function addAlternativeAddress(
  acquireId: string,
  address: string,
): CustomerDetails | undefined {
  ensureStoreInitialized();
  const details = loanDetailsMap!.get(acquireId);
  if (!details) return undefined;
  const customer: CustomerDetails = {
    ...details.customer,
    alternativeAddresses: [...details.customer.alternativeAddresses, address],
  };
  return patchCustomer(acquireId, customer);
}
