import type { ILoansApi } from './client/ILoansApi';
import type { ILoanDetailsApi } from './client/ILoanDetailsApi';
import type { ILoanActionsApi } from './client/ILoanActionsApi';
import type { IPaymentNoticesApi } from './client/IPaymentNoticesApi';
import type { IPlaceholderTabsApi } from './client/IPlaceholderTabsApi';
import type { IDashboardApi } from './client/IDashboardApi';
import type { IStatusUpdatesApi } from './client/IStatusUpdatesApi';
import { mockLoansApi } from './mock/mockLoansApi';
import { mockLoanDetailsApi } from './mock/mockLoanDetailsApi';
import { mockLoanActionsApi } from './mock/mockLoanActionsApi';
import { mockPaymentNoticesApi } from './mock/mockPaymentNoticesApi';
import { mockPlaceholderTabsApi } from './mock/mockPlaceholderTabsApi';
import { mockDashboardApi } from './mock/mockDashboardApi';
import { mockStatusUpdatesApi } from './mock/mockStatusUpdatesApi';

/** Swap point for real API implementations — all methods currently mocked. */
export const loansApi: ILoansApi = mockLoansApi;
export const loanDetailsApi: ILoanDetailsApi = mockLoanDetailsApi;
export const loanActionsApi: ILoanActionsApi = mockLoanActionsApi;
export const paymentNoticesApi: IPaymentNoticesApi = mockPaymentNoticesApi;
export const placeholderTabsApi: IPlaceholderTabsApi = mockPlaceholderTabsApi;
export const dashboardApi: IDashboardApi = mockDashboardApi;
export const statusUpdatesApi: IStatusUpdatesApi = mockStatusUpdatesApi;

export type {
  LoanListItem,
  LoanDetails,
  LoansListQuery,
  PaginatedResult,
  LoanNote,
  PromiseToPay,
  CarDetails,
  PaymentHistoryMonth,
  RepaymentInfo,
  SettlementQuote,
  PaymentNotice,
  PaymentNoticesListQuery,
  PlaceholderTabRow,
  DEFAULT_PAGE_SIZE,
  DashboardSummary,
  DashboardWorklistItem,
} from './types';

export type { PlaceholderTabKey } from './client/IPlaceholderTabsApi';
