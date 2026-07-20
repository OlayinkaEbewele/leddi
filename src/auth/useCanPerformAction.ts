import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { actionEligibility, type ActionKey, type Role } from '@/auth/roles';
import { useCurrentUser } from '@/auth/UserContext';

export interface ActionEligibilityResult {
  canPerform: boolean;
  reason: string | null;
}

export function useCanPerformAction(
  actionKey: ActionKey,
  operationalStatus: string,
  extra?: { hasActiveRecovery?: boolean; country?: string },
): ActionEligibilityResult {
  const user = useCurrentUser();
  const { t } = useTranslation();

  return useMemo(() => {
    const rule = actionEligibility[actionKey];

    if (rule.comingSoon) {
      return { canPerform: false, reason: t('actions.comingSoon') };
    }

    const hasRole = rule.requiresAnyRole.some((role) => user.roles.includes(role));
    if (!hasRole) {
      return {
        canPerform: false,
        reason: t('actions.disabled.role', {
          roles: rule.requiresAnyRole.join(', '),
        }),
      };
    }

    if (
      rule.allowedOperationalStatuses &&
      !rule.allowedOperationalStatuses.includes(operationalStatus)
    ) {
      return {
        canPerform: false,
        reason: t('actions.disabled.status', { status: operationalStatus }),
      };
    }

    if (actionKey === 'CANCEL_RECOVERY' && !extra?.hasActiveRecovery) {
      return { canPerform: false, reason: t('actions.disabled.noRecovery') };
    }

    if (actionKey === 'GENERATE_TERMINATION_LETTER' && extra?.country !== 'NG') {
      return { canPerform: false, reason: t('actions.disabled.terminationCountry') };
    }

    return { canPerform: true, reason: null };
  }, [actionKey, operationalStatus, extra?.hasActiveRecovery, extra?.country, user, t]);
}

export function userHasAnyRole(userRoles: Role[], required: Role[]): boolean {
  return required.some((role) => userRoles.includes(role));
}
