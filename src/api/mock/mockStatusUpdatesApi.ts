import type { IStatusUpdatesApi } from '@/api/client/IStatusUpdatesApi';
import type { PaginatedResult, StatusUpdateAuditEntry, StatusUpdateRequest, StatusUpdatesListQuery } from '@/api/types';
import {
  confirmStatusRequestById,
  getPendingStatusRequests,
  getStatusAuditTrail,
  rejectStatusRequestById,
} from './statusUpdates.store';
import { withMockNetwork } from './mockNetwork';
import {
  filterPendingStatusRequests,
  filterStatusAuditTrail,
  paginateStatusUpdates,
} from '@/utils/filterStatusUpdates';

export const mockStatusUpdatesApi: IStatusUpdatesApi = {
  async listPendingRequests(
    query: StatusUpdatesListQuery,
  ): Promise<PaginatedResult<StatusUpdateRequest>> {
    return withMockNetwork(() => {
      const filtered = filterPendingStatusRequests(getPendingStatusRequests(), query);
      return paginateStatusUpdates(filtered, query.page, query.pageSize);
    });
  },

  async listAuditTrail(
    query: StatusUpdatesListQuery,
  ): Promise<PaginatedResult<StatusUpdateAuditEntry>> {
    return withMockNetwork(() => {
      const filtered = filterStatusAuditTrail(getStatusAuditTrail(), query);
      return paginateStatusUpdates(filtered, query.page, query.pageSize);
    });
  },

  async confirmRequest(id: string) {
    return withMockNetwork(() => confirmStatusRequestById(id));
  },

  async rejectRequest(id: string) {
    return withMockNetwork(() => rejectStatusRequestById(id));
  },
};
