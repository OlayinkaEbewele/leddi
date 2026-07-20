import { IfrsStatusBadge } from '@/components/IfrsStatusBadge';

/** @deprecated Use IfrsStatusBadge directly */
export function IfrsStatusCell({ ifrsStatus }: { ifrsStatus: number | null }) {
  return <IfrsStatusBadge value={ifrsStatus} variant="table" />;
}
