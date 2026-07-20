import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface RestructureRequestModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: { reason: string; proposedTerms: string }) => void;
  isSubmitting?: boolean;
}

export function RestructureRequestModal({
  open,
  onClose,
  onSubmit,
  isSubmitting,
}: RestructureRequestModalProps) {
  const { t } = useTranslation();
  const [reason, setReason] = useState('');
  const [proposedTerms, setProposedTerms] = useState('');

  const handleSubmit = () => {
    onSubmit({ reason, proposedTerms });
    setReason('');
    setProposedTerms('');
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{t('restructure.title')}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          multiline
          minRows={2}
          label={t('restructure.reason')}
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
          }}
          margin="normal"
        />
        <TextField
          fullWidth
          multiline
          minRows={3}
          label={t('restructure.proposedTerms')}
          value={proposedTerms}
          onChange={(e) => {
            setProposedTerms(e.target.value);
          }}
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common.close')}</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!reason || !proposedTerms || isSubmitting}
        >
          {t('restructure.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
