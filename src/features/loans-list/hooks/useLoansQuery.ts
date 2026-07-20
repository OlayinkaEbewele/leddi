import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { loansApi } from '@/api';
import type { LoansListQuery } from '@/api/types';

export function useLoansQuery(query: LoansListQuery) {
  return useQuery({
    queryKey: ['loans', query],
    queryFn: () => loansApi.listLoans(query),
    placeholderData: keepPreviousData,
  });
}
