import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface StatusUpdateModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: { newStatus: string; reason: string }) => void;
  isSubmitting?: boolean;
}

export function StatusUpdateModal({
  open,
  onClose,
  onSubmit,
  isSubmitting,
}: StatusUpdateModalProps) {
  const { t } = useTranslation();
  const [newStatus, setNewStatus] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    onSubmit({ newStatus, reason });
    setNewStatus('');
    setReason('');
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{t('statusUpdate.title')}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label={t('statusUpdate.newStatus')}
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          multiline
          minRows={3}
          label={t('statusUpdate.reason')}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common.close')}</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!newStatus || !reason || isSubmitting}
        >
          {t('statusUpdate.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
