import type { IfrsFilterState } from '@/utils/ifrsFilter';

export const DEFAULT_PAGE_SIZE = 10;

export type { IfrsFilterState };

export interface OperationalStatus {
  status: string;
  asOfDate: string;
}

export interface LoanListItem {
  acquireId: string;
  loandiskId: string;
  customerName: string;
  customerEmail: string;
  car: string;
  vin: string;
  carId: string;
  structureCode: string;
  lender: string;
  classification: string;
  loanCategory: string;
  operationalStatus: OperationalStatus;
  dealStatus: string;
  /** patch v0.3 §1 — numeric badge only */
  ifrsStatus: number | null;
  arrearsBalance: number;
  capitalBalance: number;
  totalExposure: number;
  nextInstallmentDate: string;
  inceptionDate: string;
  maturityDate: string;
  demandNoticeDate: string | null;
  isDemandNoticeStale: boolean;
  currency: string;
  country: string;
  /** Customer-level active loan count for list card badge — mock display. */
  customerLoanCount?: number;
}

export interface AccountManager {
  name: string | null;
  email: string | null;
  territory: string | null;
  territorySupervisor: string | null;
}

export interface CarDetails {
  carId: string;
  car: string;
  vin: string;
  value: number;
  bodyType: string;
  regNumber: string;
}

export interface AlternativePhoneNumber {
  number: string;
  label?: string;
}

export interface CustomerDetails {
  actorId: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  businessName: string | null;
  birthday: string | null;
  city: string | null;
  alternativePhoneNumbers: AlternativePhoneNumber[];
  alternativeEmails: string[];
  alternativeAddresses: string[];
}

export interface LoanNote {
  id: string;
  type: 'GENERAL' | 'STATUS_UPDATE' | 'RECEIPT';
  /** Rich-text HTML produced by the Notes editor — sanitized on render. */
  content: string;
  channel: string;
  appSource: 'PRIME' | 'NEST';
  createdBy: string;
  createdAt: string;
}

export interface PromiseToPay {
  id: string;
  capturedBy: string;
  promisedDate: string;
  amount: number;
  status: 'PENDING' | 'KEPT' | 'BROKEN';
  statusTime: string;
  createdAt: string;
}

export interface Receipt {
  id: string;
  amount: number;
  receivedAt: string;
  reference: string;
}

export interface LoanDocument {
  id: string;
  fileName: string;
  fileType: string;
  uploadedAt: string;
  url: string;
  fileSizeBytes?: number;
}

export interface RecoveryStatus {
  requestedAt: string;
  requestedBy?: string;
  status: 'REQUESTED' | 'APPROVED' | 'CANCELLED' | 'COMPLETED' | 'REJECTED';
  reason: string | null;
  approvedAt?: string;
  rejectedAt?: string;
  cancelledAt?: string;
}

export interface DisposalStatus {
  listedDate: string;
  status: string;
  estimatedValue: number;
  currency: string;
  disposalOfficer: string;
}

export type LoanHistoryModule = 'PRIME' | 'NEST' | 'MIST' | 'PAPER' | 'X';

export interface LoanHistoryEntry {
  id: string;
  timestamp: string;
  module: LoanHistoryModule;
  eventType: string;
  description: string;
  actorName: string;
}

export interface CustomerLoanSummary {
  acquireId: string;
  operationalStatus: string;
  totalExposure: number;
  currency: string;
}

export interface CallLogEntry {
  id: string;
  phoneNumber: string;
  direction: 'INBOUND' | 'OUTBOUND';
  durationSeconds: number;
  occurredAt: string;
}

/** Last 6 months payment history — patch v0.3 §3 (Jan→Jun chronological). */
export interface PaymentHistoryMonth {
  monthLabel: string;
  paid: boolean;
  defaulted: boolean;
}

/** patch v0.3 §3.8 — Repayment Info section (locked field list). */
export interface RepaymentInfo {
  ifrsStatus: number | null;
  nextInstallmentDate: string;
  installmentAmount: number;
  capitalBalance: number;
  totalExposure: number;
  firstInstallmentDate: string;
  installmentDay: number;
  arrearsBalance: number;
  daysInArrears: number;
  lastDemandNoticeDate: string | null;
}

/** patch v0.3 §3.9 — same feature as drawer generate action. */
export interface SettlementQuote {
  id: string;
  amount: number | null;
  generatedAt: string | null;
  status: string | null;
}

/** patch v0.3 §3.7 — Loan Commercials section. */
export interface LoanCommercials {
  migrated: boolean;
  interestRate: number;
  interestType: string;
  structureCode: string;
  loanTermMonths: number;
  remainingTermMonths: number;
}

/** patch v0.3 §2 — Schedule tab ledger row. */
export interface ScheduleEntry {
  rowNumber: number;
  type: string;
  effectiveDate: string;
  postDate: string;
  narrative: string;
  amount: number;
  arrearsBalance: number;
  loanBalance: number;
}

/** patch v0.3 §2 — Payments tab timeline entry. */
export interface PaymentTimelineEntry {
  month: string;
  year: number;
  amount: number;
}

export interface LoanDetails extends LoanListItem {
  originationId: string;
  lastStatusChangeDate: string;
  source: string;
  residualBalance: number;
  ptpRate: number;
  lastPaymentAmount: number;
  lastPaymentDate: string;
  totalPaid: number;
  accountManager: AccountManager | null;
  carDetails: CarDetails | null;
  customer: CustomerDetails;
  loanCommercials: LoanCommercials;
  notes: LoanNote[];
  ptps: PromiseToPay[];
  receipts: Receipt[];
  documents: LoanDocument[];
  recovery: RecoveryStatus | null;
  disposal: DisposalStatus | null;
  otherLoans: CustomerLoanSummary[];
  loanHistory: LoanHistoryEntry[];
  scorecard: Record<string, unknown> | null;
  callLog: CallLogEntry[];
  paymentHistory: PaymentHistoryMonth[];
  repaymentInfo: RepaymentInfo;
  settlementQuote: SettlementQuote | null;
  scheduleEntries: ScheduleEntry[];
  paymentTimeline: PaymentTimelineEntry[];
}

export interface LoansListQuery {
  page: number;
  pageSize: number;
  searchTerm?: string;
  searchBy?: 'loanId' | 'customer' | 'vin' | 'carId' | 'email';
  ifrsFilter?: IfrsFilterState;
  demandNoticeFilter?: 'valid' | 'expired' | 'without' | '';
  country?: string;
  classification?: string;
  structureCode?: string;
  statuses?: string[];
  loanCategory?: string;
  dateRange?: { from: string; to: string };
}

export interface DashboardBucketStats {
  count: number;
  exposure?: number;
  totalPromised?: number;
}

export type DashboardWorklistReason =
  | 'stage3Overdue'
  | 'missedPayment'
  | 'ptpDueToday'
  | 'staleNotice'
  | 'pendingRestructure'
  | 'pendingStatusUpdate';

export type DashboardPriorityTier = 'critical' | 'warning' | 'low';

export interface DashboardWorklistItem {
  loan: LoanListItem;
  reason: DashboardWorklistReason;
  priorityTier: DashboardPriorityTier;
  reasonLabel: string;
  metaDetail: string;
}

export interface DashboardTrend {
  deltaPercent: number;
  direction: 'up' | 'down';
  sentiment: 'positive' | 'negative' | 'warning';
}

export interface DashboardSummary {
  totalActiveLoans: number;
  totalExposure: number;
  totalArrears: number;
  collectionRate: number;
  currency: string;
  scopeLabel: string;
  trends: {
    totalActiveLoans: DashboardTrend;
    totalArrears: DashboardTrend;
    collectionRate: DashboardTrend;
  };
  buckets: {
    stage3Overdue: DashboardBucketStats;
    missedPayment: DashboardBucketStats;
    ptpDueToday: DashboardBucketStats;
    staleDemandNotice: DashboardBucketStats;
    pendingRestructure: DashboardBucketStats;
    pendingStatusUpdates: DashboardBucketStats;
  };
  topPriorityLoans: DashboardWorklistItem[];
  totalLoanCount: number;
}

export interface DashboardQuery {
  country?: string;
}

export type PaymentNoticeAllocationStatus = 'PENDING' | 'ALLOCATED';

export interface PaymentNotice {
  id: string;
  acquireId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  createdAt: string;
  createdBy: string;
  country: string;
  product: string;
  type: string;
  amount: number;
  currency: string;
  paidAt: string | null;
  loanStatus: string;
  narrative: string;
  reference: string;
  allocationStatus: PaymentNoticeAllocationStatus;
}

export interface PaymentNoticesListQuery {
  page: number;
  pageSize: number;
  allocationStatus: PaymentNoticeAllocationStatus;
  country?: string;
  classification?: string;
  structureCode?: string;
  statuses?: string[];
  loanCategory?: string;
  dateRange?: { from: string; to: string };
  searchTerm?: string;
  searchBy?: 'acquireId' | 'reference' | 'customer' | 'email' | 'phone';
  product?: string;
  postingType?: string;
}

export type StatusUpdateView = 'PENDING' | 'AUDIT_TRAIL';

export interface StatusUpdateRequest {
  id: string;
  acquireId: string;
  requestedBy: string;
  requestedAt: string;
  currentStatus: string;
  requestedStatus: string;
  beforeRequestStatus: string;
  reason: string;
}

export interface StatusUpdateAuditEntry {
  id: string;
  acquireId: string;
  actionBy: string;
  actionAt: string;
  action: 'CONFIRMED' | 'REJECTED';
  previousStatus: string;
  newStatus: string;
  beforeRequestStatus: string;
  reason: string;
}

export interface StatusUpdatesListQuery {
  page: number;
  pageSize: number;
  acquireId?: string;
  country?: string;
  dateRange?: { from: string; to: string };
}

/** Generic row for placeholder tab grids until column specs confirmed (patch §7.7). */
export interface PlaceholderTabRow {
  id: string;
  acquireId: string;
  customerName: string;
  status: string;
  amount: number | null;
  currency: string;
  createdAt: string;
  extraField: string;
}

export interface PlaceholderTabQuery {
  page: number;
  pageSize: number;
  country?: string;
  classification?: string;
  structureCode?: string;
  statuses?: string[];
  loanCategory?: string;
  dateRange?: { from: string; to: string };
}

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface RestructureRequestPayload {
  reason: string;
  proposedTerms: string;
}

export type { ILoansApi } from './client/ILoansApi';
export type { ILoanDetailsApi } from './client/ILoanDetailsApi';
export type { ILoanActionsApi } from './client/ILoanActionsApi';
