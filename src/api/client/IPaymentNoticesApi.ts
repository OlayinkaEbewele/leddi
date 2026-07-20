import type { PaginatedResult, PaymentNotice, PaymentNoticesListQuery } from '../types';

export interface IPaymentNoticesApi {
  listPaymentNotices(query: PaymentNoticesListQuery): Promise<PaginatedResult<PaymentNotice>>;
  confirmPaymentNotice(id: string): Promise<PaymentNotice>;
  deletePaymentNotice(id: string): Promise<void>;
  updatePaymentNoticeDetails(
    id: string,
    patch: Partial<Pick<PaymentNotice, 'amount' | 'narrative' | 'reference' | 'type'>>,
  ): Promise<PaymentNotice>;
}
