import type { LoanDetails } from '@/api/types';
import { PrimeActivitiesFeed } from '../panels/PrimeActivitiesFeed';

interface ActivitiesTabProps {
  loan: LoanDetails;
}

export function ActivitiesTab({ loan }: ActivitiesTabProps) {
  return <PrimeActivitiesFeed loan={loan} />;
}
