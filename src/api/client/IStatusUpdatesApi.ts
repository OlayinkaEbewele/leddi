import type {
  PaginatedResult,
  StatusUpdateAuditEntry,
  StatusUpdateRequest,
  StatusUpdatesListQuery,
} from '../types';

export interface IStatusUpdatesApi {
  listPendingRequests(query: StatusUpdatesListQuery): Promise<PaginatedResult<StatusUpdateRequest>>;
  listAuditTrail(query: StatusUpdatesListQuery): Promise<PaginatedResult<StatusUpdateAuditEntry>>;
  confirmRequest(id: string): Promise<StatusUpdateAuditEntry>;
  rejectRequest(id: string): Promise<StatusUpdateAuditEntry>;
}
