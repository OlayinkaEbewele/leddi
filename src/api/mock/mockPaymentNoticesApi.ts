import type { IPaymentNoticesApi } from '@/api/client/IPaymentNoticesApi';
import type { PaginatedResult, PaymentNotice, PaymentNoticesListQuery } from '@/api/types';
import {
  confirmPaymentNoticeById,
  deletePaymentNoticeById,
  getPaymentNotices,
  updatePaymentNotice,
} from './fixtures/paymentNotices.store';
import { withMockNetwork } from './mockNetwork';
import { filterPaymentNotices, paginateItems } from '@/utils/filterPaymentNotices';

export const mockPaymentNoticesApi: IPaymentNoticesApi = {
  async listPaymentNotices(
    query: PaymentNoticesListQuery,
  ): Promise<PaginatedResult<PaymentNotice>> {
    return withMockNetwork(() => {
      const filtered = filterPaymentNotices(getPaymentNotices(), query);
      return paginateItems(filtered, query.page, query.pageSize);
    });
  },

  async confirmPaymentNotice(id: string) {
    return withMockNetwork(() => confirmPaymentNoticeById(id));
  },

  async deletePaymentNotice(id: string) {
    return withMockNetwork(() => {
      deletePaymentNoticeById(id);
    });
  },

  async updatePaymentNoticeDetails(id, patch) {
    return withMockNetwork(() => updatePaymentNotice(id, patch));
  },
};
