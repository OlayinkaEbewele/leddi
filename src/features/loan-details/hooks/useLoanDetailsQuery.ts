import { useQuery } from '@tanstack/react-query';
import { loanDetailsApi } from '@/api';

export function useLoanDetailsQuery(acquireId: string) {
  return useQuery({
    queryKey: ['loanDetails', acquireId],
    queryFn: () => loanDetailsApi.getLoanDetails(acquireId),
    enabled: Boolean(acquireId),
  });
}
