import { faker } from '@faker-js/faker';
import type { PaymentNotice } from '@/api/types';

const COUNTRIES = ['NG', 'GH', 'KE', 'UG'];
const PRODUCTS = ['Auto Loan', 'Fleet', 'Refinance', 'Top-up'];
const TYPES = ['Bank Transfer', 'Cash', 'Card', 'Mobile Money'];
const LOAN_STATUSES = ['ACTIVE', 'MISSEDPAYMENT', 'DEFAULTED'];

function generateNotice(index: number, status: PaymentNotice['allocationStatus']): PaymentNotice {
  const amount = faker.number.float({ min: 5000, max: 500000, fractionDigits: 2 });
  const created = faker.date.recent({ days: 60 });
  const primary = String(5300 + (index % 900)).padStart(6, '0');
  const secondary = String(4000 + (index % 500)).padStart(6, '0');

  return {
    id: `PN-${String(index + 1).padStart(5, '0')}`,
    acquireId: `${primary}:${secondary}`,
    customerName: faker.person.fullName(),
    customerEmail: faker.internet.email().toLowerCase(),
    customerPhone: faker.phone.number({ style: 'international' }),
    createdAt: created.toISOString(),
    createdBy: faker.person.fullName(),
    country: faker.helpers.arrayElement(COUNTRIES),
    product: faker.helpers.arrayElement(PRODUCTS),
    type: faker.helpers.arrayElement(TYPES),
    amount,
    currency: 'NGN',
    paidAt: status === 'ALLOCATED' ? faker.date.recent({ days: 14 }).toISOString() : null,
    loanStatus: faker.helpers.arrayElement(LOAN_STATUSES),
    narrative: faker.lorem.sentence(),
    reference: `REF-${faker.string.alphanumeric(10).toUpperCase()}`,
    allocationStatus: status,
  };
}

export function generatePaymentNoticeFixtures(): PaymentNotice[] {
  faker.seed(99);
  const pending = Array.from({ length: 35 }, (_, i) => generateNotice(i, 'PENDING'));
  const allocated = Array.from({ length: 28 }, (_, i) => generateNotice(i + 100, 'ALLOCATED'));
  return [...pending, ...allocated];
}

export const initialPaymentNotices = generatePaymentNoticeFixtures();
