export type Role =
  | 'DEAL_ADMIN'
  | 'COLLECTIONS_ADMIN_AFS'
  | 'COLLECTIONS_OFFICER_AFS'
  | 'AFS_HEAD'
  | 'PAYMENT_ADMIN'
  | 'I_SYSTEMS_ADMIN';

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  roles: Role[];
  country: string;
  /** @deprecated patch v0.2 §7.2 — no READONLY role in production; gating is per-action role checks. */
  isReadonly: boolean;
}

export type ActionKey =
  | 'REQUEST_RESTRUCTURE'
  | 'REQUEST_RECOVERY'
  | 'CANCEL_RECOVERY'
  | 'VIEW_CUSTOMER_LOANS'
  | 'RETURN_ASSET'
  | 'GENERATE_STATEMENT'
  | 'GENERATE_SETTLEMENT_QUOTE'
  | 'GENERATE_TERMINATION_LETTER'
  | 'UPDATE_STATUS'
  | 'DIRECT_DEBIT'
  | 'NEW_DEAL_ADMIN_REQUEST'
  | 'ADD_NOTE'
  | 'ADD_PTP';

export interface ActionEligibilityRule {
  requiresAnyRole: Role[];
  allowedOperationalStatuses?: string[];
  comingSoon?: boolean;
}

const OFFICER_ROLES: Role[] = ['COLLECTIONS_OFFICER_AFS', 'COLLECTIONS_ADMIN_AFS'];
const ADMIN_ROLES: Role[] = ['DEAL_ADMIN', 'AFS_HEAD', 'COLLECTIONS_ADMIN_AFS'];
const ACTION_ROLES: Role[] = [...OFFICER_ROLES, ...ADMIN_ROLES, 'PAYMENT_ADMIN', 'I_SYSTEMS_ADMIN'];

export const actionEligibility: Record<ActionKey, ActionEligibilityRule> = {
  REQUEST_RESTRUCTURE: {
    requiresAnyRole: [...OFFICER_ROLES, 'DEAL_ADMIN', 'AFS_HEAD'],
  },
  REQUEST_RECOVERY: {
    requiresAnyRole: [...OFFICER_ROLES, 'DEAL_ADMIN', 'AFS_HEAD'],
    allowedOperationalStatuses: ['DEFAULTED', 'DELINQUENT', 'IN_RECOVERY', 'MISSEDPAYMENT'],
  },
  CANCEL_RECOVERY: {
    requiresAnyRole: [...OFFICER_ROLES, 'DEAL_ADMIN', 'AFS_HEAD'],
    allowedOperationalStatuses: ['IN_RECOVERY', 'DEFAULTED'],
  },
  VIEW_CUSTOMER_LOANS: {
    requiresAnyRole: ACTION_ROLES,
  },
  RETURN_ASSET: {
    requiresAnyRole: [...OFFICER_ROLES, 'DEAL_ADMIN', 'AFS_HEAD'],
    allowedOperationalStatuses: ['IN_RECOVERY', 'REPOSSESSED'],
  },
  GENERATE_STATEMENT: {
    requiresAnyRole: [...OFFICER_ROLES, 'DEAL_ADMIN', 'PAYMENT_ADMIN', 'AFS_HEAD'],
  },
  GENERATE_SETTLEMENT_QUOTE: {
    requiresAnyRole: [...OFFICER_ROLES, 'DEAL_ADMIN', 'AFS_HEAD'],
  },
  GENERATE_TERMINATION_LETTER: {
    requiresAnyRole: [...OFFICER_ROLES, 'DEAL_ADMIN', 'AFS_HEAD'],
  },
  UPDATE_STATUS: {
    requiresAnyRole: [...OFFICER_ROLES, 'DEAL_ADMIN', 'AFS_HEAD'],
  },
  DIRECT_DEBIT: {
    requiresAnyRole: ['PAYMENT_ADMIN', 'AFS_HEAD'],
    comingSoon: true,
  },
  NEW_DEAL_ADMIN_REQUEST: {
    requiresAnyRole: ['DEAL_ADMIN', 'AFS_HEAD'],
  },
  ADD_NOTE: {
    requiresAnyRole: [...OFFICER_ROLES, 'DEAL_ADMIN', 'AFS_HEAD'],
  },
  ADD_PTP: {
    requiresAnyRole: [...OFFICER_ROLES, 'DEAL_ADMIN', 'AFS_HEAD'],
  },
};

/** Admin-equivalent users see all countries by default — patch v0.2 §3. */
export function isAdminUser(roles: Role[]): boolean {
  return roles.some((r) => ['AFS_HEAD', 'I_SYSTEMS_ADMIN', 'COLLECTIONS_ADMIN_AFS'].includes(r));
}

/**
 * Country filter default rule (patch v0.2 §3).
 * ASSUMPTION: only AFS_HEAD + I_SYSTEMS_ADMIN count as "admin" for unfiltered country —
 * patch does not define "admin" precisely.
 */
export function isCountryFilterAdmin(roles: Role[]): boolean {
  return roles.some((r) => ['AFS_HEAD', 'I_SYSTEMS_ADMIN'].includes(r));
}

// TODO(confirm): patch v0.2 §7.2 — replace isReadonly with per-action role absence logic
export function deriveIsReadonly(_roles: Role[]): boolean {
  void _roles;
  return false;
}

export function formatRoleLabel(role: Role): string {
  return role.replace(/_/g, ' ');
}
