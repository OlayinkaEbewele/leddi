import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { LoanDetails } from '@/api/types';
import type { ActionKey } from '@/auth/roles';
import { useCanPerformAction } from '@/auth/useCanPerformAction';
import { DOCUMENT_ACTIONS, buildShowWhenContext } from '../config/leftPanelActions';

interface LoanDetailsTopBarActionsProps {
  loan: LoanDetails;
  onAction: (actionKey: ActionKey) => void;
  onMoreActions: () => void;
}

export function LoanDetailsTopBarActions({ loan, onAction, onMoreActions }: LoanDetailsTopBarActionsProps) {
  const { t } = useTranslation();
  const ctx = buildShowWhenContext(loan);
  const [documentsAnchor, setDocumentsAnchor] = useState<HTMLElement | null>(null);

  return (
    <Stack direction="row" spacing={0.75} alignItems="center" useFlexGap flexWrap="wrap">
      <ActionButton
        actionKey="UPDATE_STATUS"
        loan={loan}
        ctx={ctx}
        onAction={onAction}
        variant="contained"
        label={t('actions.UPDATE_STATUS')}
      />
      <ActionButton
        actionKey="REQUEST_RESTRUCTURE"
        loan={loan}
        ctx={ctx}
        onAction={onAction}
        variant="outlined"
        label={t('actions.REQUEST_RESTRUCTURE')}
      />
      <Button
        size="small"
        variant="outlined"
        endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 18 }} />}
        onClick={(e) => setDocumentsAnchor(e.currentTarget)}
        sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.8125rem' }}
      >
        {t('loanDetails.topBar.documents')}
      </Button>
      <Menu
        anchorEl={documentsAnchor}
        open={Boolean(documentsAnchor)}
        onClose={() => setDocumentsAnchor(null)}
      >
        {DOCUMENT_ACTIONS.map((actionKey) => (
          <DocumentMenuItem
            key={actionKey}
            actionKey={actionKey}
            loan={loan}
            ctx={ctx}
            onSelect={(key) => {
              setDocumentsAnchor(null);
              onAction(key);
            }}
            label={t(`actions.${actionKey}`)}
          />
        ))}
      </Menu>
      <Button
        size="small"
        variant="outlined"
        startIcon={<MoreHorizIcon sx={{ fontSize: 18 }} />}
        onClick={onMoreActions}
        sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.8125rem' }}
      >
        {t('loanDetails.topBar.moreActions')}
      </Button>
    </Stack>
  );
}

function ActionButton({
  actionKey,
  loan,
  ctx,
  onAction,
  variant,
  label,
}: {
  actionKey: ActionKey;
  loan: LoanDetails;
  ctx: ReturnType<typeof buildShowWhenContext>;
  onAction: (key: ActionKey) => void;
  variant: 'contained' | 'outlined';
  label: string;
}) {
  const eligibility = useCanPerformAction(actionKey, loan.operationalStatus.status, {
    hasActiveRecovery: ctx.hasActiveRecovery,
    country: loan.country,
  });

  const button = (
    <Button
      size="small"
      variant={variant}
      disabled={!eligibility.canPerform}
      onClick={() => onAction(actionKey)}
      sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.8125rem' }}
    >
      {label}
    </Button>
  );

  if (!eligibility.canPerform && eligibility.reason) {
    return (
      <Tooltip title={eligibility.reason}>
        <span>{button}</span>
      </Tooltip>
    );
  }

  return button;
}

function DocumentMenuItem({
  actionKey,
  loan,
  ctx,
  onSelect,
  label,
}: {
  actionKey: ActionKey;
  loan: LoanDetails;
  ctx: ReturnType<typeof buildShowWhenContext>;
  onSelect: (key: ActionKey) => void;
  label: string;
}) {
  const eligibility = useCanPerformAction(actionKey, loan.operationalStatus.status, {
    hasActiveRecovery: ctx.hasActiveRecovery,
    country: loan.country,
  });

  const item = (
    <MenuItem disabled={!eligibility.canPerform} onClick={() => onSelect(actionKey)}>
      {label}
    </MenuItem>
  );

  if (!eligibility.canPerform && eligibility.reason) {
    return (
      <Tooltip title={eligibility.reason} placement="left">
        <span>{item}</span>
      </Tooltip>
    );
  }

  return item;
}
