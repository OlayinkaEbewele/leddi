import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import type { PaymentNotice } from '@/api/types';
import { textSecondary } from '@/theme/theme';
import { formatAmountOnly } from '@/utils/formatCurrency';
import { formatIsoDate } from '@/utils/formatDate';
import { confirmButtonSx, rejectButtonSx } from './StatusUpdateActionDialogs';

interface ConfirmAllocateDialogProps {
  open: boolean;
  notice: PaymentNotice | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

interface DeleteRecordDialogProps {
  open: boolean;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

interface EditNoticeDialogProps {
  open: boolean;
  notice: PaymentNotice | null;
  loading?: boolean;
  onClose: () => void;
  onSave: (patch: Partial<Pick<PaymentNotice, 'amount' | 'narrative' | 'reference'>>) => void;
}

function formatNoticeAmount(amount: number, currency: string): string {
  return `${currency} ${formatAmountOnly(amount)}`;
}

function DetailLine({ label, value }: { label: string; value: string }) {
  return (
    <Stack direction="row" spacing={1} alignItems="flex-start">
      <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 148, flexShrink: 0 }}>
        {label}:
      </Typography>
      <Typography variant="body2" sx={{ color: textSecondary, wordBreak: 'break-word' }}>
        {value}
      </Typography>
    </Stack>
  );
}

export function ConfirmAllocateDialog({
  open,
  notice,
  loading,
  onClose,
  onConfirm,
}: ConfirmAllocateDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('paymentNotices.confirm.title')}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
          {t('paymentNotices.confirm.heading')}
        </Typography>
        {notice && (
          <Stack spacing={1.25}>
            <DetailLine label={t('paymentNotices.confirm.acquireId')} value={notice.acquireId} />
            <DetailLine
              label={t('paymentNotices.confirm.amount')}
              value={formatNoticeAmount(notice.amount, notice.currency)}
            />
            <DetailLine label={t('paymentNotices.confirm.date')} value={formatIsoDate(notice.createdAt)} />
            <DetailLine label={t('paymentNotices.confirm.reference')} value={notice.reference} />
            <DetailLine label={t('paymentNotices.confirm.narrative')} value={notice.narrative} />
          </Stack>
        )}
        <Typography variant="body2" sx={{ fontWeight: 600, mt: 2.5 }}>
          {t('paymentNotices.confirm.areYouSure')}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {t('notes.add.cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          disabled={loading || !notice}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : undefined}
          sx={confirmButtonSx}
        >
          {t('paymentNotices.confirm.confirmButton')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export function DeleteRecordDialog({ open, loading, onClose, onConfirm }: DeleteRecordDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{t('paymentNotices.delete.title')}</DialogTitle>
      <DialogContent>
        <Typography variant="body2">{t('paymentNotices.delete.message')}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {t('notes.add.cancel')}
        </Button>
        <Button
          variant="outlined"
          onClick={onConfirm}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : undefined}
          sx={rejectButtonSx}
        >
          {t('paymentNotices.delete.confirmButton')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export function EditNoticeDialog({ open, notice, loading, onClose, onSave }: EditNoticeDialogProps) {
  const { t } = useTranslation();
  const [amount, setAmount] = useState('');
  const [narrative, setNarrative] = useState('');
  const [reference, setReference] = useState('');

  useEffect(() => {
    if (notice && open) {
      setAmount(String(notice.amount));
      setNarrative(notice.narrative);
      setReference(notice.reference);
    }
  }, [notice, open]);

  const handleSave = () => {
    onSave({
      amount: Number(amount),
      narrative,
      reference,
    });
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{t('paymentNotices.actions.editRequest')}</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
        <TextField
          label={t('paymentNotices.columns.amount')}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          size="small"
          type="number"
        />
        <TextField
          label={t('paymentNotices.columns.narrative')}
          value={narrative}
          onChange={(e) => setNarrative(e.target.value)}
          size="small"
          multiline
          minRows={2}
        />
        <TextField
          label={t('paymentNotices.columns.reference')}
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          size="small"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {t('notes.add.cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading || !notice}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : undefined}
        >
          {t('paymentNotices.actions.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
