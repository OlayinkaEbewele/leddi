import { differenceInDays, parseISO } from 'date-fns';

/** Stale threshold: >30 days past demand notice date. TODO(confirm): §4.1.1 / §9.1 */
export const DEMAND_NOTICE_STALE_DAYS = 30;

export function isDemandNoticeStale(
  demandNoticeDate: string | null,
  asOf: Date = new Date(),
): boolean {
  if (!demandNoticeDate) return false;
  const noticeDate = parseISO(demandNoticeDate);
  return differenceInDays(asOf, noticeDate) > DEMAND_NOTICE_STALE_DAYS;
}
