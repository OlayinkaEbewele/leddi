import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface AssetRecoveryModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  isSubmitting?: boolean;
  errorMessage?: string | null;
}

export function AssetRecoveryModal({
  open,
  onClose,
  onSubmit,
  isSubmitting,
  errorMessage,
}: AssetRecoveryModalProps) {
  const { t } = useTranslation();
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    onSubmit(reason);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{t('recovery.title')}</DialogTitle>
      <DialogContent>
        {errorMessage && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}
        <TextField
          fullWidth
          multiline
          minRows={3}
          label={t('recovery.reason')}
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
          }}
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common.close')}</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!reason || isSubmitting}>
          {t('recovery.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
