import { formatDistanceToNow, parseISO } from 'date-fns';
import { formatDisplayDate } from '@/utils/formatDate';

/** Relative time for recent dates; absolute for older entries. */
export function formatRelativeOrAbsolute(iso: string, relativeWithinDays = 7): string {
  try {
    const date = parseISO(iso);
    const daysAgo = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
    if (daysAgo <= relativeWithinDays) {
      return formatDistanceToNow(date, { addSuffix: true });
    }
    return formatDisplayDate(iso);
  } catch {
    return iso;
  }
}
