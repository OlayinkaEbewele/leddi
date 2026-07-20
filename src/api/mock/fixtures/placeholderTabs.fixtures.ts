import { faker } from '@faker-js/faker';
import type { PlaceholderTabRow } from '@/api/types';
import type { PlaceholderTabKey } from '@/api/client/IPlaceholderTabsApi';

function generateRow(index: number, tab: PlaceholderTabKey): PlaceholderTabRow {
  const primary = String(5300 + (index % 900)).padStart(6, '0');
  const secondary = String(4000 + (index % 500)).padStart(6, '0');
  const statuses: Record<PlaceholderTabKey, string[]> = {
    PTP: ['PENDING', 'KEPT', 'BROKEN'],
    RESTRUCTURE: ['REQUESTED', 'APPROVED', 'REJECTED'],
    STATUS_UPDATES: ['SUBMITTED', 'APPROVED', 'PENDING'],
    SETTLED_DEALS: ['SETTLED', 'PARTIAL'],
    DEAL_ADMIN_REQUESTS: ['OPEN', 'CLOSED'],
  };

  return {
    id: `${tab}-${index}`,
    acquireId: `${primary}:${secondary}`,
    customerName: faker.person.fullName(),
    status: faker.helpers.arrayElement(statuses[tab]),
    amount: faker.number.float({ min: 10000, max: 800000, fractionDigits: 2 }),
    currency: 'NGN',
    createdAt: faker.date.recent({ days: 90 }).toISOString(),
    extraField: faker.lorem.words(3),
  };
}

export function generatePlaceholderFixtures(): Record<PlaceholderTabKey, PlaceholderTabRow[]> {
  faker.seed(77);
  const tabs: PlaceholderTabKey[] = [
    'PTP',
    'RESTRUCTURE',
    'STATUS_UPDATES',
    'SETTLED_DEALS',
    'DEAL_ADMIN_REQUESTS',
  ];
  const map = {} as Record<PlaceholderTabKey, PlaceholderTabRow[]>;
  tabs.forEach((tab) => {
    map[tab] = Array.from({ length: 42 }, (_, i) => generateRow(i, tab));
  });
  return map;
}

export const initialPlaceholderData = generatePlaceholderFixtures();
