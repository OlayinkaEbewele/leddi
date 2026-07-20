import type { LoanDetails } from '@/api/types';
import type { ActionKey } from '@/auth/roles';

export interface ShowWhenContext {
  loan: LoanDetails;
  hasActiveRecovery: boolean;
  hasRecoveryRecord: boolean;
  hasDisposal: boolean;
}

export interface LeftPanelActionDef {
  actionKey: ActionKey;
  variant: 'contained' | 'outlined';
  showWhen: (ctx: ShowWhenContext) => boolean;
}

/** Contextual left-panel actions — hidden entirely when showWhen is false. */
export const LEFT_PANEL_ACTIONS: LeftPanelActionDef[] = [
  {
    actionKey: 'ADD_PTP',
    variant: 'contained',
    showWhen: () => true,
  },
  {
    actionKey: 'REQUEST_RECOVERY',
    variant: 'outlined',
    showWhen: (ctx) => !ctx.hasRecoveryRecord,
  },
  {
    actionKey: 'CANCEL_RECOVERY',
    variant: 'outlined',
    showWhen: (ctx) => ctx.hasActiveRecovery,
  },
  {
    actionKey: 'REQUEST_RESTRUCTURE',
    variant: 'outlined',
    showWhen: (ctx) =>
      ['DELINQUENT', 'MISSEDPAYMENT', 'DEFAULTED', 'IN_RECOVERY'].includes(
        ctx.loan.operationalStatus.status,
      ),
  },
  {
    actionKey: 'UPDATE_STATUS',
    variant: 'outlined',
    showWhen: () => true,
  },
  {
    actionKey: 'VIEW_CUSTOMER_LOANS',
    variant: 'outlined',
    showWhen: (ctx) => (ctx.loan.customerLoanCount ?? 1) > 1,
  },
];

export const DOCUMENT_ACTIONS: ActionKey[] = [
  'GENERATE_STATEMENT',
  'GENERATE_SETTLEMENT_QUOTE',
  'GENERATE_TERMINATION_LETTER',
];

export function buildShowWhenContext(loan: LoanDetails): ShowWhenContext {
  const hasRecoveryRecord = loan.recovery != null;
  const hasActiveRecovery =
    hasRecoveryRecord &&
    loan.recovery!.status !== 'CANCELLED' &&
    loan.recovery!.status !== 'COMPLETED' &&
    loan.recovery!.status !== 'REJECTED';

  return {
    loan,
    hasActiveRecovery,
    hasRecoveryRecord,
    hasDisposal: loan.disposal != null,
  };
}
