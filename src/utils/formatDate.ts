import { format, parseISO } from 'date-fns';

/** Patch v0.2 §3 — e.g. "Wed, Aug 07, 2024" */
export const DISPLAY_DATE_FORMAT = 'EEE, MMM dd, yyyy';

export function formatDate(isoDate: string | null | undefined, fallback = '—'): string {
  if (!isoDate) return fallback;
  try {
    return format(parseISO(isoDate), 'dd MMM yyyy');
  } catch {
    return fallback;
  }
}

export function formatDisplayDate(isoDate: string | null | undefined, fallback = '—'): string {
  if (!isoDate) return fallback;
  try {
    return format(parseISO(isoDate), DISPLAY_DATE_FORMAT);
  } catch {
    return fallback;
  }
}

/** Dashboard header — e.g. "Monday, 30 June 2026" */
export function formatLongDashboardDate(date = new Date()): string {
  return format(date, 'EEEE, d MMMM yyyy');
}

export function formatDateTime(isoDate: string | null | undefined, fallback = '—'): string {
  if (!isoDate) return fallback;
  try {
    return format(parseISO(isoDate), 'dd MMM yyyy HH:mm');
  } catch {
    return fallback;
  }
}

/** ISO calendar date — e.g. 2026-06-30 */
export function formatIsoDate(isoDate: string | null | undefined, fallback = '—'): string {
  if (!isoDate) return fallback;
  try {
    return format(parseISO(isoDate), 'yyyy-MM-dd');
  } catch {
    return fallback;
  }
}
