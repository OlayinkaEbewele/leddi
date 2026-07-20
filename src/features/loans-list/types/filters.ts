import type { IfrsFilterState } from '@/utils/ifrsFilter';
import { EMPTY_IFRS_FILTER } from '@/utils/ifrsFilter';

/** Global filter bar — shared across all 7 Prime tabs (patch v0.2 §3). */
export interface GlobalFiltersState {
  country: string;
  classification: string;
  structureCode: string;
  statuses: string[];
  loanCategory: string;
  dateFrom: string;
  dateTo: string;
}

export type LoanSearchBy = 'loanId' | 'customer' | 'vin' | 'carId' | 'email';

export type DemandNoticeFilter = '' | 'valid' | 'expired' | 'without';

/** Tab-local filters for the Loans tab only (patch v0.2 §3). */
export interface LoansLocalFiltersState {
  searchBy: LoanSearchBy;
  searchTerm: string;
  demandNoticeFilter: DemandNoticeFilter;
  ifrsFilter: IfrsFilterState;
}

export const EMPTY_GLOBAL_FILTERS: GlobalFiltersState = {
  country: '',
  classification: '',
  structureCode: '',
  statuses: [],
  loanCategory: '',
  dateFrom: '',
  dateTo: '',
};

export const EMPTY_LOANS_LOCAL_FILTERS: LoansLocalFiltersState = {
  searchBy: 'loanId',
  searchTerm: '',
  demandNoticeFilter: '',
  ifrsFilter: { ...EMPTY_IFRS_FILTER },
};

export const LOAN_SEARCH_BY_OPTIONS: LoanSearchBy[] = [
  'loanId',
  'customer',
  'vin',
  'carId',
  'email',
];

export type PaymentNoticeSearchBy = 'acquireId' | 'reference' | 'customer' | 'email' | 'phone';

export interface PaymentNoticesLocalFiltersState {
  searchBy: PaymentNoticeSearchBy;
  searchTerm: string;
  productFilter: string;
  postingTypeFilter: string;
}

export const EMPTY_PAYMENT_NOTICES_LOCAL_FILTERS: PaymentNoticesLocalFiltersState = {
  searchBy: 'acquireId',
  searchTerm: '',
  productFilter: '',
  postingTypeFilter: '',
};

export const PAYMENT_NOTICE_SEARCH_BY_OPTIONS: PaymentNoticeSearchBy[] = [
  'acquireId',
  'reference',
  'customer',
  'email',
  'phone',
];

export const PAYMENT_NOTICE_PRODUCTS = ['Auto Loan', 'Fleet', 'Refinance', 'Top-up'] as const;

export const PAYMENT_NOTICE_POSTING_TYPES = [
  'Bank Transfer',
  'Cash',
  'Card',
  'Mobile Money',
] as const;

export type { IfrsFilterState };
