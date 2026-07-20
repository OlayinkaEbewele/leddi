import { faker } from '@faker-js/faker';
import type {
  CallLogEntry,
  CarDetails,
  CustomerLoanSummary,
  DisposalStatus,
  LoanCommercials,
  LoanDetails,
  LoanDocument,
  LoanHistoryEntry,
  LoanHistoryModule,
  LoanListItem,
  LoanNote,
  PaymentHistoryMonth,
  PaymentTimelineEntry,
  PromiseToPay,
  Receipt,
  RecoveryStatus,
  RepaymentInfo,
  ScheduleEntry,
  SettlementQuote,
} from '@/api/types';
import { isDemandNoticeStale } from '@/utils/demandNotice';

const STRUCTURE_CODES = ['NG-20', 'NG-12', 'NG-25', 'NG-07', 'KE-03', 'UG-01'];
const CLASSIFICATIONS = [
  'NG RIDEHAIL_MIG',
  'KE DISC_MIG',
  'UG VEHFIN_MIG',
  'NG VEHFIN',
  'NG RETAIL',
];
const LOAN_CATEGORIES = ['Uncategorized', 'Normal', 'Commercial', 'Top-up'];
const OPERATIONAL_STATUSES = ['ACTIVE', 'MISSEDPAYMENT', 'DEFAULTED', 'DELINQUENT', 'IN_RECOVERY'];
const DEAL_STATUSES = ['ACTIVE', 'PENDING', 'COMPLETED', 'CANCELLED'];
const CURRENCIES = ['NGN', 'GHS', 'KES', 'UGX'];
const COUNTRIES = ['NG', 'GH', 'KE', 'UG'];
const IFRS_SAMPLES: Array<number | null> = [null, 0, 0, 1, 2, 3];

const SCHEDULE_TYPES = [
  'CONVTAKEONCRBAL',
  'BTR-CONVTAKEONCRBAL',
  'INS',
  'REC_CASH',
  'BTR-REC_CASH',
  'BTR-INS',
];

const DEMAND_NOTICE_HTML = `<p><strong>Subject: Demand Notice — Outstanding Loan Arrears</strong></p>
<p>Dear Customer,</p>
<p>This is to formally notify you that your loan account remains in arrears. Despite previous reminders, we have not received the outstanding instalment(s) due on your facility.</p>
<p>Please remit the full overdue amount within <strong>7 calendar days</strong> of this notice to avoid further recovery action, including possible repossession of the financed asset.</p>
<p>If you have already made payment, kindly disregard this notice and forward proof of payment to our collections team.</p>
<p>Regards,<br/>Collections Operations</p>`;

function randomIfrsStatus(): number | null {
  return faker.helpers.arrayElement(IFRS_SAMPLES);
}

function generateDemandNoticeDate(stale: boolean): string | null {
  if (Math.random() < 0.2) return null;
  const daysAgo = stale
    ? faker.number.int({ min: 31, max: 180 })
    : faker.number.int({ min: 0, max: 29 });
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
}

function generateAcquireId(index: number): string {
  const customerBucket = Math.floor(index / 3);
  const primary = String(5300 + (customerBucket % 900)).padStart(6, '0');
  const secondary = String(4000 + (index % 500)).padStart(6, '0');
  return `${primary}:${secondary}`;
}

function acquireIdCustomerKey(acquireId: string): string {
  return acquireId.split(':')[0] ?? acquireId;
}

function generateLoanListItem(index: number, options?: { forceStale?: boolean }): LoanListItem {
  const forceStale = options?.forceStale ?? index % 7 === 0;
  const demandNoticeDate = generateDemandNoticeDate(forceStale);
  const currency = faker.helpers.arrayElement(CURRENCIES);
  const country = faker.helpers.arrayElement(COUNTRIES);
  const customerName = faker.person.fullName();
  const opStatus = faker.helpers.arrayElement(OPERATIONAL_STATUSES);
  const statusDate = faker.date.recent({ days: 120 });

  const nextInstallment = new Date();
  nextInstallment.setDate(nextInstallment.getDate() + faker.number.int({ min: 7, max: 180 }));
  const maturity = new Date();
  maturity.setFullYear(maturity.getFullYear() + faker.number.int({ min: 1, max: 3 }));

  const loandiskId =
    Math.random() < 0.2 ? 'None' : `LD-${faker.string.alphanumeric(8).toUpperCase()}`;

  const carLabel = `${faker.vehicle.manufacturer()} ${faker.vehicle.model()}`;

  return {
    acquireId: generateAcquireId(index),
    loandiskId,
    customerName,
    customerEmail: faker.internet.email({ firstName: customerName.split(' ')[0] }).toLowerCase(),
    car: carLabel,
    vin: faker.vehicle.vin(),
    carId: `CAR-${faker.string.alphanumeric(8).toUpperCase()}`,
    structureCode: faker.helpers.arrayElement(STRUCTURE_CODES),
    lender:
      Math.random() < 0.3
        ? ''
        : faker.helpers.arrayElement(['AFS Nigeria', 'AFS Ghana', 'Partner Bank']),
    classification: faker.helpers.arrayElement(CLASSIFICATIONS),
    loanCategory: faker.helpers.arrayElement(LOAN_CATEGORIES),
    operationalStatus: {
      status: opStatus,
      asOfDate: statusDate.toISOString().split('T')[0],
    },
    dealStatus: faker.helpers.arrayElement(DEAL_STATUSES),
    ifrsStatus: randomIfrsStatus(),
    arrearsBalance: faker.number.float({ min: 0, max: 500000, fractionDigits: 2 }),
    capitalBalance: faker.number.float({ min: 100000, max: 5000000, fractionDigits: 2 }),
    totalExposure: faker.number.float({ min: 100000, max: 5500000, fractionDigits: 2 }),
    nextInstallmentDate: nextInstallment.toISOString().split('T')[0],
    inceptionDate: faker.date.past({ years: 3 }).toISOString().split('T')[0],
    maturityDate: maturity.toISOString().split('T')[0],
    demandNoticeDate,
    isDemandNoticeStale: isDemandNoticeStale(demandNoticeDate),
    currency,
    country,
    customerLoanCount: faker.number.int({ min: 1, max: 5 }),
  };
}

function generatePaymentHistory(): PaymentHistoryMonth[] {
  const months: PaymentHistoryMonth[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const defaulted = Math.random() < 0.12;
    months.push({
      monthLabel: d.toLocaleString('en', { month: 'short' }),
      paid: !defaulted && Math.random() > 0.08,
      defaulted,
    });
  }
  return months;
}

function generateNotes(count: number, author: string, rich = false): LoanNote[] {
  const channels = ['EMAIL', 'SMS', 'WHATSAPP'];
  const notes: LoanNote[] = Array.from({ length: count }, (_, i) => ({
    id: faker.string.uuid(),
    type: faker.helpers.arrayElement(['GENERAL', 'STATUS_UPDATE', 'RECEIPT'] as const),
    content: rich && i === 0 ? DEMAND_NOTICE_HTML : `<p>${faker.lorem.paragraph()}</p>`,
    channel: i === 0 && rich ? 'EMAIL' : faker.helpers.arrayElement(channels),
    appSource: i === 0 && rich ? 'PRIME' : faker.helpers.arrayElement(['PRIME', 'NEST'] as const),
    createdBy: i === 0 && rich ? 'System Reminder' : author,
    createdAt: faker.date.recent({ days: 90 }).toISOString(),
  }));
  return notes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

function generatePtps(count: number): PromiseToPay[] {
  return Array.from({ length: count }, () => {
    const promised = new Date();
    promised.setDate(promised.getDate() + faker.number.int({ min: 1, max: 30 }));
    const statusTime = faker.date.recent({ days: 30 });
    return {
      id: `PTP-${faker.number.int({ min: 1000, max: 9999 })}`,
      capturedBy: faker.person.fullName(),
      amount: faker.number.float({ min: 50000, max: 250000, fractionDigits: 0 }),
      promisedDate: promised.toISOString().split('T')[0]!,
      status: faker.helpers.arrayElement(['PENDING', 'KEPT', 'BROKEN'] as const),
      statusTime: statusTime.toISOString(),
      createdAt: statusTime.toISOString(),
    };
  });
}

function generateDocuments(count: number): LoanDocument[] {
  const files = [
    { fileName: 'Loan agreement.pdf', fileType: 'pdf', fileSizeBytes: 254_000 },
    { fileName: 'Insurance certificate.pdf', fileType: 'pdf', fileSizeBytes: 312_000 },
    { fileName: 'Vehicle registration.zip', fileType: 'zip', fileSizeBytes: 1_240_000 },
    { fileName: 'Demand notice.pdf', fileType: 'pdf', fileSizeBytes: 186_000 },
  ];
  return Array.from({ length: count }, (_, i) => {
    const preset = files[i % files.length]!;
    return {
      id: faker.string.uuid(),
      fileName: preset.fileName,
      fileType: preset.fileType,
      fileSizeBytes: preset.fileSizeBytes,
      uploadedAt: faker.date.recent({ days: 120 }).toISOString(),
      url: `#mock-document/${preset.fileName}`,
    };
  });
}

function generateReceipts(count: number): Receipt[] {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    amount: faker.number.float({ min: 50000, max: 250000, fractionDigits: 0 }),
    receivedAt: faker.date.recent({ days: 90 }).toISOString(),
    reference: `RC-${faker.string.alphanumeric(4).toUpperCase()}`,
  }));
}

function generateCallLog(count: number, phone: string): CallLogEntry[] {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    phoneNumber: phone,
    direction: faker.helpers.arrayElement(['INBOUND', 'OUTBOUND'] as const),
    durationSeconds: faker.number.int({ min: 15, max: 1800 }),
    occurredAt: faker.date.recent({ days: 30 }).toISOString(),
  })).sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());
}

function buildRepaymentInfo(base: LoanListItem): RepaymentInfo {
  const installmentDay = faker.number.int({ min: 1, max: 28 });
  const firstInstallment = new Date(base.inceptionDate);
  firstInstallment.setDate(installmentDay);
  return {
    ifrsStatus: base.ifrsStatus,
    nextInstallmentDate: base.nextInstallmentDate,
    installmentAmount: faker.number.float({ min: 35000, max: 250000, fractionDigits: 2 }),
    capitalBalance: base.capitalBalance,
    totalExposure: base.totalExposure,
    firstInstallmentDate: firstInstallment.toISOString().split('T')[0],
    installmentDay,
    arrearsBalance: base.arrearsBalance,
    daysInArrears: faker.number.int({ min: 0, max: 120 }),
    lastDemandNoticeDate: base.demandNoticeDate,
  };
}

function buildLoanCommercials(base: LoanListItem): LoanCommercials {
  const loanTermMonths = faker.number.int({ min: 12, max: 48 });
  return {
    migrated: faker.datatype.boolean(),
    interestRate: faker.number.float({ min: 8, max: 28, fractionDigits: 2 }),
    interestType: faker.helpers.arrayElement(['Fixed', 'Variable']),
    structureCode: base.structureCode,
    loanTermMonths,
    remainingTermMonths: faker.number.int({ min: 1, max: loanTermMonths }),
  };
}

function generateScheduleEntries(base: LoanListItem): ScheduleEntry[] {
  const count = faker.number.int({ min: 32, max: 45 });
  let arrears = base.arrearsBalance;
  let loanBal = base.capitalBalance;
  const entries: ScheduleEntry[] = [];

  for (let i = 1; i <= count; i++) {
    const type = faker.helpers.arrayElement(SCHEDULE_TYPES);
    const amount =
      type.includes('REC') || type === 'INS'
        ? faker.number.float({ min: 20000, max: 250000, fractionDigits: 2 })
        : -faker.number.float({ min: 5000, max: 180000, fractionDigits: 2 });
    arrears += amount * 0.15;
    loanBal += amount * 0.4;
    const effective = faker.date.past({ years: 2 });
    const post = new Date(effective);
    post.setDate(post.getDate() + faker.number.int({ min: 0, max: 3 }));

    entries.push({
      rowNumber: i,
      type,
      effectiveDate: effective.toISOString().split('T')[0],
      postDate: post.toISOString().split('T')[0],
      narrative: type.startsWith('BTR')
        ? `STRUCTURE TRANSFER IN (ARREARS) ${base.structureCode}`
        : `${faker.string.numeric(8)}_PAYMENT`,
      amount,
      arrearsBalance: Math.round(arrears * 100) / 100,
      loanBalance: Math.round(loanBal * 100) / 100,
    });
  }

  return entries;
}

function generatePaymentTimeline(currency: string): PaymentTimelineEntry[] {
  void currency;
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const count = faker.number.int({ min: 12, max: 18 });
  const now = new Date();
  const entries: PaymentTimelineEntry[] = [];

  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    entries.push({
      month: months[d.getMonth()],
      year: d.getFullYear(),
      amount: faker.number.float({ min: 35000, max: 280000, fractionDigits: 2 }),
    });
  }

  return entries;
}

function buildOtherLoans(
  currentAcquireId: string,
  listItems: LoanListItem[],
): CustomerLoanSummary[] {
  const customerKey = acquireIdCustomerKey(currentAcquireId);
  return listItems
    .filter(
      (item) =>
        item.acquireId !== currentAcquireId &&
        acquireIdCustomerKey(item.acquireId) === customerKey,
    )
    .map((item) => ({
      acquireId: item.acquireId,
      operationalStatus: item.operationalStatus.status,
      totalExposure: item.totalExposure,
      currency: item.currency,
    }));
}

const HISTORY_MODULES: LoanHistoryModule[] = ['PRIME', 'NEST', 'MIST', 'PAPER', 'X'];

function generateLoanHistory(acquireId: string): LoanHistoryEntry[] {
  const count = faker.number.int({ min: 8, max: 12 });
  const modules = faker.helpers.shuffle([...HISTORY_MODULES]).slice(0, 3);
  const events = [
    'Status updated',
    'PTP captured',
    'Recovery request submitted',
    'Asset listed for disposal',
    'Payment notice sent',
    'Demand letter generated',
    'Note added',
    'Settlement quote generated',
    'Call logged',
    'Document uploaded',
  ];

  return Array.from({ length: count }, (_, i) => {
    const module = faker.helpers.arrayElement(modules);
    const daysAgo = i * faker.number.int({ min: 2, max: 14 });
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return {
      id: `LH-${acquireId}-${i}`,
      timestamp: date.toISOString(),
      module,
      eventType: faker.helpers.arrayElement(events),
      description: `${faker.helpers.arrayElement(events)} for ${acquireId.split(':')[0]}`,
      actorName: faker.person.fullName(),
    };
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

function generateDisposal(base: LoanListItem): DisposalStatus | null {
  if (!['IN_RECOVERY', 'DEFAULTED'].includes(base.operationalStatus.status)) return null;
  if (Math.random() > 0.35) return null;
  return {
    listedDate: faker.date.recent({ days: 30 }).toISOString().split('T')[0],
    status: faker.helpers.arrayElement(['LISTED', 'VALUATION', 'AUCTION', 'SOLD']),
    estimatedValue: faker.number.float({ min: 500000, max: 8000000, fractionDigits: 2 }),
    currency: base.currency,
    disposalOfficer: faker.person.fullName(),
  };
}

function buildRecoveryStatus(base: LoanListItem, richness: string): RecoveryStatus | null {
  const eligible = ['IN_RECOVERY', 'DEFAULTED', 'DELINQUENT', 'MISSEDPAYMENT'].includes(
    base.operationalStatus.status,
  );
  if (!eligible) return null;
  if (richness !== 'rich' && Math.random() > 0.4) return null;

  const status = faker.helpers.arrayElement([
    'REQUESTED',
    'APPROVED',
    'CANCELLED',
    'REJECTED',
  ] as const);
  const requestedAt = faker.date.recent({ days: 21 }).toISOString();

  return {
    requestedAt,
    requestedBy: faker.person.fullName(),
    status,
    reason: faker.lorem.sentence(),
    ...(status === 'APPROVED' ? { approvedAt: faker.date.recent({ days: 7 }).toISOString() } : {}),
    ...(status === 'REJECTED' ? { rejectedAt: faker.date.recent({ days: 5 }).toISOString() } : {}),
    ...(status === 'CANCELLED'
      ? { cancelledAt: faker.date.recent({ days: 3 }).toISOString() }
      : {}),
  };
}

function placeholderSettlementQuote(): SettlementQuote | null {
  if (Math.random() < 0.55) return null;
  return {
    id: faker.string.uuid(),
    amount: faker.number.float({ min: 100000, max: 2000000, fractionDigits: 2 }),
    generatedAt: faker.date.recent({ days: 30 }).toISOString(),
    status: 'DRAFT',
  };
}

function enrichToLoanDetails(
  base: LoanListItem,
  richness: 'rich' | 'thin' | 'normal',
  allListItems: LoanListItem[],
): LoanDetails {
  const phone = faker.phone.number();
  const lastPaymentDate = faker.date.recent({ days: 45 }).toISOString().split('T')[0];
  const lastPaymentAmount = faker.number.float({ min: 35000, max: 250000, fractionDigits: 2 });
  const totalPaid = faker.number.float({ min: 500000, max: 4000000, fractionDigits: 2 });

  const noteCount = richness === 'rich' ? 6 : richness === 'thin' ? 0 : 2;
  const ptpCount = richness === 'rich' ? 3 : richness === 'thin' ? 0 : 1;
  const docCount = richness === 'rich' ? 5 : richness === 'thin' ? 0 : 1;
  const receiptCount = richness === 'rich' ? 4 : richness === 'thin' ? 0 : 1;
  const callCount = richness === 'rich' ? 6 : richness === 'thin' ? 0 : 2;

  const recovery = buildRecoveryStatus(base, richness);

  const year = faker.number.int({ min: 2005, max: 2022 });
  const make = faker.vehicle.manufacturer().toUpperCase();
  const model = faker.vehicle.model().toUpperCase();
  const carDetails: CarDetails | null =
    richness === 'thin'
      ? null
      : {
          carId: `CAR-${faker.string.alphanumeric(8).toUpperCase()}`,
          car: `${make} ${model} ${year}`,
          vin: faker.vehicle.vin(),
          value: faker.number.float({ min: 800000, max: 12000000, fractionDigits: 2 }),
          bodyType: faker.helpers.arrayElement(['Sedan', 'SUV', 'Hatchback', 'Van']),
          regNumber: faker.vehicle.vrm().toUpperCase(),
        };

  const hasManager = richness === 'rich' && Math.random() > 0.3;

  const siblingLoans = buildOtherLoans(base.acquireId, allListItems);
  const customerLoanCount = siblingLoans.length + 1;
  const customerKey = acquireIdCustomerKey(base.acquireId);

  return {
    ...base,
    customerLoanCount,
    originationId: `ORG-${faker.string.numeric(8)}`,
    vin: carDetails?.vin ?? base.vin,
    carId: carDetails?.carId ?? base.carId,
    lastStatusChangeDate: base.operationalStatus.asOfDate,
    source: faker.helpers.arrayElement(['ONLINE', 'DEALER', 'PARTNER', 'MIGRATED']),
    residualBalance: faker.number.float({ min: 0, max: 500000, fractionDigits: 2 }),
    ptpRate: faker.number.int({ min: 0, max: 100 }),
    lastPaymentAmount,
    lastPaymentDate,
    totalPaid,
    accountManager: hasManager
      ? {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          territory: faker.location.state(),
          territorySupervisor: faker.person.fullName(),
        }
      : {
          name: null,
          email: null,
          territory: null,
          territorySupervisor: null,
        },
    carDetails,
    customer: {
      actorId: customerKey,
      fullName: base.customerName,
      email: base.customerEmail,
      phone,
      address: faker.location.streetAddress({ useFullAddress: true }),
      businessName: Math.random() < 0.4 ? faker.company.name() : null,
      birthday: faker.date.birthdate({ min: 25, max: 60, mode: 'age' }).toISOString().split('T')[0],
      city: faker.helpers.arrayElement(['lagos', 'abuja', 'nairobi', 'accra']),
      alternativePhoneNumbers:
        richness === 'thin'
          ? []
          : [
              { number: faker.phone.number(), label: 'Work' },
              { number: faker.phone.number(), label: 'Spouse' },
            ],
      alternativeEmails: richness === 'thin' ? [] : [faker.internet.email()],
      alternativeAddresses: richness === 'thin' ? [] : [faker.location.secondaryAddress()],
    },
    loanCommercials: buildLoanCommercials(base),
    notes: generateNotes(noteCount, 'Collections Officer', richness === 'rich'),
    ptps: generatePtps(ptpCount),
    receipts: generateReceipts(receiptCount),
    documents: generateDocuments(docCount),
    recovery,
    disposal: generateDisposal(base),
    otherLoans: siblingLoans,
    loanHistory: richness === 'thin' ? [] : generateLoanHistory(base.acquireId),
    scorecard:
      richness === 'rich'
        ? {
            riskScore: faker.number.int({ min: 1, max: 100 }),
            paymentHistory: faker.helpers.arrayElement(['Good', 'Fair', 'Poor']),
          }
        : null,
    callLog: generateCallLog(callCount, phone),
    paymentHistory: richness === 'thin' ? [] : generatePaymentHistory(),
    repaymentInfo: buildRepaymentInfo(base),
    settlementQuote: richness === 'rich' ? placeholderSettlementQuote() : null,
    scheduleEntries: richness === 'thin' ? [] : generateScheduleEntries(base),
    paymentTimeline: richness === 'thin' ? [] : generatePaymentTimeline(base.currency),
  };
}

export const LOAN_COUNT = 200;

export function generateLoanFixtures(): LoanListItem[] {
  faker.seed(42);
  const loans: LoanListItem[] = [];

  for (let i = 0; i < LOAN_COUNT; i++) {
    loans.push(generateLoanListItem(i));
  }

  IFRS_SAMPLES.forEach((status, idx) => {
    if (loans[idx]) loans[idx].ifrsStatus = status;
  });

  return loans;
}

export function generateLoanDetailsFixtures(listItems: LoanListItem[]): Map<string, LoanDetails> {
  const map = new Map<string, LoanDetails>();

  listItems.forEach((item, index) => {
    let richness: 'rich' | 'thin' | 'normal' = 'normal';
    if (index < 5) richness = 'rich';
    else if (index >= LOAN_COUNT - 8) richness = 'thin';
    map.set(item.acquireId, enrichToLoanDetails(item, richness, listItems));
  });

  return map;
}

let cachedListItems: LoanListItem[] | undefined;
let cachedDetailsMap: Map<string, LoanDetails> | undefined;

/** Lazy init — avoids crashing app boot if fixture generation fails at import time. */
export function getInitialLoanListItems(): LoanListItem[] {
  if (!cachedListItems) {
    cachedListItems = generateLoanFixtures();
  }
  return cachedListItems;
}

export function getInitialLoanDetailsMap(): Map<string, LoanDetails> {
  if (!cachedDetailsMap) {
    cachedDetailsMap = generateLoanDetailsFixtures(getInitialLoanListItems());
  }
  return cachedDetailsMap;
}
