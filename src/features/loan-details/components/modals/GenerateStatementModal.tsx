import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface GenerateStatementModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (dateRange: { from: string; to: string }) => void;
  isSubmitting?: boolean;
  success?: boolean;
}

export function GenerateStatementModal({
  open,
  onClose,
  onSubmit,
  isSubmitting,
  success,
}: GenerateStatementModalProps) {
  const { t } = useTranslation();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const handleSubmit = () => {
    onSubmit({ from, to });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{t('statement.title')}</DialogTitle>
      <DialogContent>
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {t('statement.success')}
          </Alert>
        )}
        <TextField
          fullWidth
          type="date"
          label={t('statement.from')}
          value={from}
          onChange={(e) => {
            setFrom(e.target.value);
          }}
          margin="normal"
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField
          fullWidth
          type="date"
          label={t('statement.to')}
          value={to}
          onChange={(e) => {
            setTo(e.target.value);
          }}
          margin="normal"
          slotProps={{ inputLabel: { shrink: true } }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common.close')}</Button>
        <Button variant="outlined" disabled>
          {t('statement.downloadDisabled')}
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!from || !to || isSubmitting}>
          {t('statement.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
