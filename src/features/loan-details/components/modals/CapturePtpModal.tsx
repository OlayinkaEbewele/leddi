import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface CapturePtpModalProps {
  open: boolean;
  onClose: () => void;
  isSubmitting: boolean;
  onSubmit: (data: { amount: number; promisedDate: string }) => Promise<void>;
}

export function CapturePtpModal({ open, onClose, isSubmitting, onSubmit }: CapturePtpModalProps) {
  const { t } = useTranslation();
  const { register, handleSubmit, reset } = useForm<{ amount: string; promisedDate: string }>({
    defaultValues: { amount: '', promisedDate: '' },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{t('loanDetails.promises.capture')}</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
        <TextField
          label={t('loanDetails.promises.promisedAmount')}
          type="number"
          size="small"
          {...register('amount')}
        />
        <TextField
          label={t('loanDetails.promises.dueDate')}
          type="date"
          size="small"
          slotProps={{ inputLabel: { shrink: true } }}
          {...register('promisedDate')}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('notes.add.cancel')}</Button>
        <Button
          variant="contained"
          disabled={isSubmitting}
          onClick={() =>
            void handleSubmit(async (data) => {
              await onSubmit({ amount: Number(data.amount), promisedDate: data.promisedDate });
              reset();
            })()
          }
        >
          {t('loanDetails.promises.capture')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
