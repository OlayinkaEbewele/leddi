import { faker } from '@faker-js/faker';
import type { StatusUpdateAuditEntry, StatusUpdateRequest } from '@/api/types';

const SEED_REQUESTS: Omit<StatusUpdateRequest, 'id'>[] = [
  {
    acquireId: 'ACQ-NG-47781',
    requestedBy: 'Samuel Oji',
    requestedAt: '2025-06-01T16:42:00.000Z',
    currentStatus: 'In Arrears',
    requestedStatus: 'Performing',
    beforeRequestStatus: 'Watchlist',
    reason: 'Customer resumed payments after 2 missed instalments — moving back to performing.',
  },
  {
    acquireId: 'ACQ-NG-49002',
    requestedBy: 'Grace Etim',
    requestedAt: '2025-06-01T14:18:00.000Z',
    currentStatus: 'Watchlist',
    requestedStatus: 'Delinquent',
    beforeRequestStatus: 'Watchlist',
    reason: 'PTP broken twice, escalating from watchlist to delinquent.',
  },
  {
    acquireId: 'ACQ-NG-48890',
    requestedBy: 'Daniel Yaro',
    requestedAt: '2025-05-31T11:05:00.000Z',
    currentStatus: 'Restructured',
    requestedStatus: 'Restructured',
    beforeRequestStatus: 'Delinquent',
    reason: 'Restructure approved by credit committee, ref RC-2231.',
  },
];

const STATUSES = [
  { current: 'In Arrears', requested: 'Performing', before: 'Watchlist' },
  { current: 'Watchlist', requested: 'Delinquent', before: 'Performing' },
  { current: 'Delinquent', requested: 'Litigation', before: 'Delinquent' },
  { current: 'Performing', requested: 'Watchlist', before: 'Performing' },
  { current: 'Restructured', requested: 'Performing', before: 'Restructured' },
];

export function generateStatusUpdateFixtures(): {
  pending: StatusUpdateRequest[];
  audit: StatusUpdateAuditEntry[];
} {
  faker.seed(204);

  const pending: StatusUpdateRequest[] = SEED_REQUESTS.map((row, i) => ({
    id: `SU-P-${String(i + 1).padStart(4, '0')}`,
    ...row,
  }));

  for (let i = SEED_REQUESTS.length; i < 11; i++) {
    const status = faker.helpers.arrayElement(STATUSES);
    pending.push({
      id: `SU-P-${String(i + 1).padStart(4, '0')}`,
      acquireId: `ACQ-NG-${faker.number.int({ min: 47000, max: 49999 })}`,
      requestedBy: faker.person.fullName(),
      requestedAt: faker.date.recent({ days: 14 }).toISOString(),
      currentStatus: status.current,
      requestedStatus: status.requested,
      beforeRequestStatus: status.before,
      reason: faker.lorem.sentence(),
    });
  }

  const audit: StatusUpdateAuditEntry[] = Array.from({ length: 16 }, (_, i) => {
    const status = faker.helpers.arrayElement(STATUSES);
    const action = faker.helpers.arrayElement(['CONFIRMED', 'REJECTED'] as const);
    return {
      id: `SU-A-${String(i + 1).padStart(4, '0')}`,
      acquireId: `ACQ-NG-${faker.number.int({ min: 47000, max: 49999 })}`,
      actionBy: faker.person.fullName(),
      actionAt: faker.date.recent({ days: 30 }).toISOString(),
      action,
      previousStatus: status.current,
      newStatus: action === 'CONFIRMED' ? status.requested : status.current,
      beforeRequestStatus: status.before,
      reason: faker.lorem.sentence(),
    };
  });

  return { pending, audit };
}

export const initialStatusUpdateFixtures = generateStatusUpdateFixtures();
