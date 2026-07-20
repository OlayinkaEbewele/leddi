import type { StatusUpdateAuditEntry, StatusUpdateRequest } from '@/api/types';
import { initialStatusUpdateFixtures } from './fixtures/statusUpdates.fixtures';

let pendingRequests: StatusUpdateRequest[] = [...initialStatusUpdateFixtures.pending];
let auditTrail: StatusUpdateAuditEntry[] = [...initialStatusUpdateFixtures.audit];

export function getPendingStatusRequests(): StatusUpdateRequest[] {
  return pendingRequests;
}

export function getStatusAuditTrail(): StatusUpdateAuditEntry[] {
  return auditTrail;
}

export function getPendingStatusRequest(id: string): StatusUpdateRequest | undefined {
  return pendingRequests.find((r) => r.id === id);
}

function moveToAudit(
  request: StatusUpdateRequest,
  action: StatusUpdateAuditEntry['action'],
  actionBy: string,
): StatusUpdateAuditEntry {
  const entry: StatusUpdateAuditEntry = {
    id: `SU-A-${Date.now()}`,
    acquireId: request.acquireId,
    actionBy,
    actionAt: new Date().toISOString(),
    action,
    previousStatus: request.currentStatus,
    newStatus: action === 'CONFIRMED' ? request.requestedStatus : request.currentStatus,
    beforeRequestStatus: request.beforeRequestStatus,
    reason: request.reason,
  };
  auditTrail = [entry, ...auditTrail];
  pendingRequests = pendingRequests.filter((r) => r.id !== request.id);
  return entry;
}

export function confirmStatusRequestById(id: string): StatusUpdateAuditEntry {
  const request = getPendingStatusRequest(id);
  if (!request) throw new Error('Status update request not found');
  return moveToAudit(request, 'CONFIRMED', 'Current User');
}

export function rejectStatusRequestById(id: string): StatusUpdateAuditEntry {
  const request = getPendingStatusRequest(id);
  if (!request) throw new Error('Status update request not found');
  return moveToAudit(request, 'REJECTED', 'Current User');
}
