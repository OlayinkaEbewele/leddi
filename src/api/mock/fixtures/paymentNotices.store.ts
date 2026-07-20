/**
 * In-memory store for payment notice mutations. Resets on page reload. PRD §7.4
 */
import type { PaymentNotice } from '@/api/types';
import { initialPaymentNotices } from './paymentNotices.fixtures';

let paymentNotices: PaymentNotice[] = [...initialPaymentNotices];

export function getPaymentNotices(): PaymentNotice[] {
  return paymentNotices;
}

export function getPaymentNotice(id: string): PaymentNotice | undefined {
  return paymentNotices.find((n) => n.id === id);
}

export function updatePaymentNotice(id: string, patch: Partial<PaymentNotice>): PaymentNotice {
  const idx = paymentNotices.findIndex((n) => n.id === id);
  if (idx < 0) throw new Error(`Payment notice not found: ${id}`);
  const updated = { ...paymentNotices[idx], ...patch };
  paymentNotices = paymentNotices.map((n) => (n.id === id ? updated : n));
  return updated;
}

export function deletePaymentNoticeById(id: string): void {
  paymentNotices = paymentNotices.filter((n) => n.id !== id);
}

export function confirmPaymentNoticeById(id: string): PaymentNotice {
  return updatePaymentNotice(id, {
    allocationStatus: 'ALLOCATED',
    paidAt: new Date().toISOString(),
  });
}
