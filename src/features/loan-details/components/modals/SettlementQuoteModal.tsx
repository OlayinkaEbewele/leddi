import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useTranslation } from 'react-i18next';

interface SettlementQuoteModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  success?: boolean;
}

export function SettlementQuoteModal({
  open,
  onClose,
  onSubmit,
  isSubmitting,
  success,
}: SettlementQuoteModalProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{t('settlement.title')}</DialogTitle>
      <DialogContent>
        {success && <Alert severity="success">{t('settlement.success')}</Alert>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common.close')}</Button>
        <Button variant="contained" onClick={onSubmit} disabled={isSubmitting}>
          {t('settlement.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
