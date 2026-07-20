import MenuIcon from '@mui/icons-material/Menu';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Snackbar from '@mui/material/Snackbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { LoanDetails } from '@/api/types';
import type { ActionKey } from '@/auth/roles';
import { useCanPerformAction } from '@/auth/useCanPerformAction';
import { useLoanActions } from '../hooks/useLoanActions';
import { AssetRecoveryModal } from './modals/AssetRecoveryModal';
import { DealAdminRequestModal } from './modals/DealAdminRequestModal';
import { GenerateStatementModal } from './modals/GenerateStatementModal';
import { RestructureRequestModal } from './modals/RestructureRequestModal';
import { SettlementQuoteModal } from './modals/SettlementQuoteModal';
import { StatusUpdateModal } from './modals/StatusUpdateModal';

interface LoanActionsDrawerProps {
  loan: LoanDetails;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideTrigger?: boolean;
  initialAction?: ActionKey | null;
  onInitialActionConsumed?: () => void;
}

type ModalKey =
  | 'restructure'
  | 'recovery'
  | 'status'
  | 'statement'
  | 'settlement'
  | 'termination'
  | 'dealAdmin'
  | null;

const DRAWER_ACTIONS: ActionKey[] = [
  'REQUEST_RESTRUCTURE',
  'REQUEST_RECOVERY',
  'CANCEL_RECOVERY',
  'VIEW_CUSTOMER_LOANS',
  'RETURN_ASSET',
  'GENERATE_STATEMENT',
  'GENERATE_SETTLEMENT_QUOTE',
  'GENERATE_TERMINATION_LETTER',
  'UPDATE_STATUS',
  'DIRECT_DEBIT',
  'NEW_DEAL_ADMIN_REQUEST',
];

export function LoanActionsDrawer({
  loan,
  open: openProp,
  onOpenChange,
  hideTrigger = false,
  initialAction = null,
  onInitialActionConsumed,
}: LoanActionsDrawerProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [internalOpen, setInternalOpen] = useState(false);
  const open = openProp ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;
  const [activeModal, setActiveModal] = useState<ModalKey>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [recoveryError, setRecoveryError] = useState<string | null>(null);
  const [statementSuccess, setStatementSuccess] = useState(false);
  const [settlementSuccess, setSettlementSuccess] = useState(false);

  const actions = useLoanActions(loan.acquireId);
  const hasActiveRecovery =
    loan.recovery != null &&
    loan.recovery.status !== 'CANCELLED' &&
    loan.recovery.status !== 'COMPLETED' &&
    loan.recovery.status !== 'REJECTED';

  const showSuccess = (message: string) => {
    setSnackbar({ open: true, message, severity: 'success' });
  };

  const showError = (message: string) => {
    setSnackbar({ open: true, message, severity: 'error' });
  };

  const handleActionClick = (actionKey: ActionKey, eligibility: { canPerform: boolean }) => {
    if (!eligibility.canPerform) return;

    switch (actionKey) {
      case 'REQUEST_RESTRUCTURE':
        setActiveModal('restructure');
        break;
      case 'REQUEST_RECOVERY':
        setRecoveryError(null);
        setActiveModal('recovery');
        break;
      case 'CANCEL_RECOVERY':
        void actions.cancelAssetRecovery.mutateAsync().then(
          () => {
            showSuccess(t('actions.success'));
          },
          () => {
            showError(t('actions.error'));
          },
        );
        break;
      case 'VIEW_CUSTOMER_LOANS':
        // TODO(confirm): §4.2.3 — pre-filter loans list by customer identity
        navigate(`/prime/loans?search=${encodeURIComponent(loan.customerName)}`);
        break;
      case 'RETURN_ASSET':
        void actions.requestStatusUpdate
          .mutateAsync({ newStatus: 'ACTIVE', reason: 'Asset returned to customer (mock)' })
          .then(
            () => {
              showSuccess(t('actions.success'));
            },
            () => {
              showError(t('actions.error'));
            },
          );
        break;
      case 'GENERATE_STATEMENT':
        setStatementSuccess(false);
        setActiveModal('statement');
        break;
      case 'GENERATE_SETTLEMENT_QUOTE':
        setSettlementSuccess(false);
        setActiveModal('settlement');
        break;
      case 'GENERATE_TERMINATION_LETTER':
        void actions.generateTerminationLetter.mutateAsync().then(
          () => {
            showSuccess(t('termination.success'));
          },
          () => {
            showError(t('actions.error'));
          },
        );
        break;
      case 'UPDATE_STATUS':
        setActiveModal('status');
        break;
      case 'NEW_DEAL_ADMIN_REQUEST':
        setActiveModal('dealAdmin');
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (!open || !initialAction) return;
    handleActionClick(initialAction, { canPerform: true });
    onInitialActionConsumed?.();
  }, [open, initialAction]);

  return (
    <>
      {!hideTrigger && (
        <Tooltip title={t('loanDetails.actions')}>
          <IconButton
            onClick={() => {
              setOpen(true);
            }}
            aria-label={t('loanDetails.actions')}
            color="primary"
          >
            <MenuIcon />
          </IconButton>
        </Tooltip>
      )}

      <Drawer
        anchor="right"
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <Box sx={{ width: 320, p: 2 }} role="navigation" aria-label={t('loanDetails.actions')}>
          <Typography variant="h6" gutterBottom>
            {t('loanDetails.actions')}
          </Typography>
          <List dense>
            {DRAWER_ACTIONS.map((actionKey) => (
              <ActionListItem
                key={actionKey}
                actionKey={actionKey}
                loan={loan}
                hasActiveRecovery={hasActiveRecovery}
                onClick={(eligibility) => {
                  handleActionClick(actionKey, eligibility);
                }}
              />
            ))}
          </List>
        </Box>
      </Drawer>

      <RestructureRequestModal
        open={activeModal === 'restructure'}
        onClose={() => {
          setActiveModal(null);
        }}
        isSubmitting={actions.requestRestructure.isPending}
        onSubmit={(payload) => {
          void actions.requestRestructure.mutateAsync(payload).then(
            () => {
              showSuccess(t('actions.success'));
              setActiveModal(null);
            },
            () => {
              showError(t('actions.error'));
            },
          );
        }}
      />

      <AssetRecoveryModal
        open={activeModal === 'recovery'}
        onClose={() => {
          setActiveModal(null);
          setRecoveryError(null);
        }}
        isSubmitting={actions.requestAssetRecovery.isPending}
        errorMessage={recoveryError}
        onSubmit={(reason) => {
          void actions.requestAssetRecovery.mutateAsync(reason).then(
            () => {
              showSuccess(t('actions.success'));
              setActiveModal(null);
            },
            (err: unknown) => {
              if (err instanceof Error && err.message === 'CHECK_REPOSSESSION') {
                setRecoveryError(t('actions.recovery.checkRepossession'));
              } else {
                showError(t('actions.error'));
              }
            },
          );
        }}
      />

      <StatusUpdateModal
        open={activeModal === 'status'}
        onClose={() => {
          setActiveModal(null);
        }}
        isSubmitting={actions.requestStatusUpdate.isPending}
        onSubmit={(values) => {
          void actions.requestStatusUpdate.mutateAsync(values).then(
            () => {
              showSuccess(t('actions.success'));
              setActiveModal(null);
            },
            () => {
              showError(t('actions.error'));
            },
          );
        }}
      />

      <GenerateStatementModal
        open={activeModal === 'statement'}
        onClose={() => {
          setActiveModal(null);
          setStatementSuccess(false);
        }}
        isSubmitting={actions.generateStatement.isPending}
        success={statementSuccess}
        onSubmit={(dateRange) => {
          void actions.generateStatement.mutateAsync(dateRange).then(
            () => {
              setStatementSuccess(true);
              showSuccess(t('statement.success'));
            },
            () => {
              showError(t('actions.error'));
            },
          );
        }}
      />

      <SettlementQuoteModal
        open={activeModal === 'settlement'}
        onClose={() => {
          setActiveModal(null);
          setSettlementSuccess(false);
        }}
        isSubmitting={actions.generateSettlementQuote.isPending}
        success={settlementSuccess}
        onSubmit={() => {
          void actions.generateSettlementQuote.mutateAsync().then(
            () => {
              setSettlementSuccess(true);
              showSuccess(t('settlement.success'));
            },
            () => {
              showError(t('actions.error'));
            },
          );
        }}
      />

      <DealAdminRequestModal
        open={activeModal === 'dealAdmin'}
        onClose={() => {
          setActiveModal(null);
        }}
        isSubmitting={actions.requestRestructure.isPending}
        onSubmit={(details) => {
          void actions.requestRestructure
            .mutateAsync({ reason: details, proposedTerms: 'Deal admin request (mock)' })
            .then(
              () => {
                showSuccess(t('actions.success'));
                setActiveModal(null);
              },
              () => {
                showError(t('actions.error'));
              },
            );
        }}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => {
          setSnackbar((s) => ({ ...s, open: false }));
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => {
            setSnackbar((s) => ({ ...s, open: false }));
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

function ActionListItem({
  actionKey,
  loan,
  hasActiveRecovery,
  onClick,
}: {
  actionKey: ActionKey;
  loan: LoanDetails;
  hasActiveRecovery: boolean;
  onClick: (eligibility: { canPerform: boolean }) => void;
}) {
  const { t } = useTranslation();
  const eligibility = useCanPerformAction(actionKey, loan.operationalStatus.status, {
    hasActiveRecovery,
    country: loan.country,
  });

  const label = t(`actions.${actionKey}`);
  const disabled = !eligibility.canPerform;

  return (
    <ListItem disablePadding sx={{ mb: 0.5 }}>
      <Tooltip title={disabled ? (eligibility.reason ?? '') : ''} placement="left">
        <span style={{ width: '100%' }}>
          <Button
            fullWidth
            variant="outlined"
            disabled={disabled}
            onClick={() => {
              onClick(eligibility);
            }}
            sx={{ justifyContent: 'flex-start', textAlign: 'left' }}
          >
            {label}
          </Button>
        </span>
      </Tooltip>
    </ListItem>
  );
}
