import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { paymentNoticesApi } from '@/api';
import type { PaymentNoticesListQuery } from '@/api/types';

export function usePaymentNoticesQuery(query: PaymentNoticesListQuery) {
  return useQuery({
    queryKey: ['paymentNotices', query],
    queryFn: () => paymentNoticesApi.listPaymentNotices(query),
    placeholderData: keepPreviousData,
  });
}
