import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface DealAdminRequestModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (details: string) => void;
  isSubmitting?: boolean;
}

export function DealAdminRequestModal({
  open,
  onClose,
  onSubmit,
  isSubmitting,
}: DealAdminRequestModalProps) {
  const { t } = useTranslation();
  const [details, setDetails] = useState('');

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{t('dealAdmin.title')}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          multiline
          minRows={4}
          label={t('dealAdmin.reason')}
          value={details}
          onChange={(e) => {
            setDetails(e.target.value);
          }}
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common.close')}</Button>
        <Button
          variant="contained"
          onClick={() => {
            onSubmit(details);
            setDetails('');
          }}
          disabled={!details || isSubmitting}
        >
          {t('dealAdmin.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
