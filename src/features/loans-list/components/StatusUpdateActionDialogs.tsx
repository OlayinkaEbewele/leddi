import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import type { StatusUpdateRequest } from '@/api/types';
import { tokenVars } from '@/theme/cssVars';
import { textSecondary } from '@/theme/theme';
import { StatusValueTag } from './StatusValueTag';

const confirmButtonSx = {
  bgcolor: tokenVars.accent,
  color: '#FFFFFF',
  textTransform: 'none',
  fontWeight: 600,
  boxShadow: 'none',
  minWidth: 120,
  '&:hover': {
    bgcolor: tokenVars.accentHover,
    boxShadow: 'none',
  },
  '&.Mui-disabled': {
    bgcolor: tokenVars.accent,
    color: '#FFFFFF',
    opacity: 0.45,
  },
} as const;

const rejectButtonSx = {
  textTransform: 'none',
  fontWeight: 600,
  borderColor: tokenVars.danger,
  color: tokenVars.danger,
  minWidth: 120,
  '&:hover': {
    borderColor: tokenVars.danger,
    bgcolor: 'color-mix(in srgb, var(--leddi-danger) 12%, transparent)',
  },
  '&.Mui-disabled': {
    borderColor: tokenVars.danger,
    color: tokenVars.danger,
    opacity: 0.45,
  },
} as const;

const deleteRequestButtonSx = {
  textTransform: 'none',
  fontWeight: 600,
  borderColor: tokenVars.textMuted,
  color: tokenVars.textMuted,
  minWidth: 120,
  '&:hover': {
    borderColor: tokenVars.chipTones.riskStage3.border,
    bgcolor: tokenVars.chipTones.riskStage3.bg,
    color: tokenVars.chipTones.riskStage3.color,
  },
  '&.Mui-disabled': {
    borderColor: tokenVars.textMuted,
    color: tokenVars.textMuted,
    opacity: 0.45,
  },
} as const;

interface StatusUpdateConfirmDialogProps {
  open: boolean;
  request: StatusUpdateRequest | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

interface StatusUpdateRejectDialogProps {
  open: boolean;
  request: StatusUpdateRequest | null;
  loading?: boolean;
  onClose: () => void;
  onReject: () => void;
}

function formatRequestedAt(iso: string): string {
  try {
    return format(new Date(iso), 'd MMM yyyy, HH:mm');
  } catch {
    return iso;
  }
}

function RequestSummary({ request }: { request: StatusUpdateRequest }) {
  const { t } = useTranslation();

  return (
    <Stack spacing={1.5}>
      <DetailLine label={t('statusUpdates.filters.acquireId')} value={request.acquireId} />
      <DetailLine label={t('statusUpdates.confirm.requestedBy')} value={request.requestedBy} />
      <DetailLine
        label={t('statusUpdates.confirm.requestedAt')}
        value={formatRequestedAt(request.requestedAt)}
      />
      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
        <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 148, flexShrink: 0 }}>
          {t('statusUpdates.confirm.statusChange')}:
        </Typography>
        <StatusValueTag value={request.currentStatus} />
        <Typography variant="body2" sx={{ color: textSecondary }}>
          →
        </Typography>
        <StatusValueTag value={request.requestedStatus} />
      </Stack>
      <DetailLine label={t('statusUpdates.confirm.reason')} value={request.reason} />
    </Stack>
  );
}

function DetailLine({ label, value }: { label: string; value: string }) {
  return (
    <Stack direction="row" spacing={1} alignItems="flex-start">
      <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 148, flexShrink: 0 }}>
        {label}:
      </Typography>
      <Typography variant="body2" sx={{ color: textSecondary }}>
        {value}
      </Typography>
    </Stack>
  );
}

export function StatusUpdateConfirmDialog({
  open,
  request,
  loading,
  onClose,
  onConfirm,
}: StatusUpdateConfirmDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('statusUpdates.confirm.title')}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
          {t('statusUpdates.confirm.heading')}
        </Typography>
        {request && <RequestSummary request={request} />}
        <Typography variant="body2" sx={{ fontWeight: 600, mt: 2.5 }}>
          {t('statusUpdates.confirm.areYouSure')}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {t('notes.add.cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          disabled={loading || !request}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : undefined}
          sx={confirmButtonSx}
        >
          {t('statusUpdates.actions.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export function StatusUpdateRejectDialog({
  open,
  request,
  loading,
  onClose,
  onReject,
}: StatusUpdateRejectDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('statusUpdates.reject.title')}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
          {t('statusUpdates.reject.heading')}
        </Typography>
        {request && <RequestSummary request={request} />}
        <Typography variant="body2" sx={{ fontWeight: 600, mt: 2.5 }}>
          {t('statusUpdates.reject.areYouSure')}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {t('notes.add.cancel')}
        </Button>
        <Button
          variant="outlined"
          onClick={onReject}
          disabled={loading || !request}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : undefined}
          sx={rejectButtonSx}
        >
          {t('statusUpdates.actions.reject')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export { confirmButtonSx, rejectButtonSx, deleteRequestButtonSx };
