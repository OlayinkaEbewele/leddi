import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { LoanDetails } from '@/api/types';
import { ValueTag } from '@/components/ValueTag';
import { formatDate } from '@/utils/formatDate';
import {
  borderSubtle,
  dashboardGreen,
  textMuted,
  textPrimary,
  textSecondary,
} from '@/theme/theme';
import { useLoanActions } from '../../hooks/useLoanActions';
import { DetailSection } from './DetailSection';

interface CustomerDetailsSectionProps {
  loan: LoanDetails;
  embedded?: boolean;
}

export function CustomerDetailsSection({ loan, embedded }: CustomerDetailsSectionProps) {
  const { t } = useTranslation();
  const actions = useLoanActions(loan.acquireId);
  const [saveState, setSaveState] = useState<'idle' | 'success' | 'error'>('idle');
  const [phoneDialog, setPhoneDialog] = useState(false);
  const [emailDialog, setEmailDialog] = useState(false);
  const [addressDialog, setAddressDialog] = useState(false);
  const [newPhone, setNewPhone] = useState({ number: '', label: '' });
  const [newEmail, setNewEmail] = useState('');
  const [newAddress, setNewAddress] = useState('');

  const c = loan.customer;
  const na = t('loanDetails.notAvailable');

  const handleAddPhone = async () => {
    try {
      await actions.addAlternativePhoneNumber.mutateAsync({
        number: newPhone.number,
        label: newPhone.label || undefined,
      });
      setPhoneDialog(false);
      setNewPhone({ number: '', label: '' });
      setSaveState('success');
    } catch {
      setSaveState('error');
    }
  };

  const handleAddEmail = async () => {
    try {
      await actions.addAlternativeEmail.mutateAsync(newEmail);
      setEmailDialog(false);
      setNewEmail('');
      setSaveState('success');
    } catch {
      setSaveState('error');
    }
  };

  const handleAddAddress = async () => {
    try {
      await actions.addAlternativeAddress.mutateAsync(newAddress);
      setAddressDialog(false);
      setNewAddress('');
      setSaveState('success');
    } catch {
      setSaveState('error');
    }
  };

  return (
    <DetailSection title={t('loanDetails.sections.customer')} embedded={embedded}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(5, 1fr)',
          },
          columnGap: 3,
          rowGap: 2.5,
          alignItems: 'start',
        }}
      >
        <CustomerFieldColumn>
          <CustomerField label={t('loanDetails.customer.actorId')} value={c.actorId} emphasis />
          <CustomerField
            label={t('loanDetails.customer.birthday')}
            value={c.birthday ? formatDate(c.birthday) : na}
            emphasis
          />
        </CustomerFieldColumn>

        <CustomerFieldColumn>
          <CustomerField label={t('loanDetails.customer.name')} value={c.fullName} emphasis />
          <CustomerField label={t('loanDetails.customer.address')} value={c.address} muted />
        </CustomerFieldColumn>

        <CustomerFieldColumn>
          <CustomerField label={t('loanDetails.customer.phone')} value={c.phone} emphasis />
          <CustomerField
            label={t('loanDetails.customer.city')}
            value={c.city ? <ValueTag value={c.city} /> : na}
          />
        </CustomerFieldColumn>

        <CustomerFieldColumn>
          <CustomerField label={t('loanDetails.customer.email')} value={c.email} emphasis />
        </CustomerFieldColumn>

        <CustomerFieldColumn>
          <CustomerField
            label={t('loanDetails.customer.businessName')}
            value={c.businessName ?? na}
            muted
          />
        </CustomerFieldColumn>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 2,
          mt: 3,
        }}
      >
        <AlternativeCard
          title={t('loanDetails.customer.altPhones')}
          onAdd={() => {
            setPhoneDialog(true);
          }}
        >
          {c.alternativePhoneNumbers.length === 0 ? (
            <Typography variant="body2" sx={{ color: textMuted, fontSize: '0.8125rem' }}>
              {na}
            </Typography>
          ) : (
            c.alternativePhoneNumbers.map((p) => (
              <AlternativeRow
                key={p.number}
                value={p.label ? `${p.label}: ${p.number}` : p.number}
                onEdit={() => {
                  setNewPhone({ number: p.number, label: p.label ?? '' });
                  setPhoneDialog(true);
                }}
              />
            ))
          )}
        </AlternativeCard>

        <AlternativeCard
          title={t('loanDetails.customer.altEmails')}
          onAdd={() => {
            setEmailDialog(true);
          }}
        >
          {c.alternativeEmails.length === 0 ? (
            <Typography variant="body2" sx={{ color: textMuted, fontSize: '0.8125rem' }}>
              {na}
            </Typography>
          ) : (
            c.alternativeEmails.map((email) => (
              <AlternativeRow
                key={email}
                value={email}
                onEdit={() => {
                  setNewEmail(email);
                  setEmailDialog(true);
                }}
              />
            ))
          )}
        </AlternativeCard>

        <AlternativeCard
          title={t('loanDetails.customer.altAddresses')}
          onAdd={() => {
            setAddressDialog(true);
          }}
        >
          {c.alternativeAddresses.length === 0 ? (
            <Typography variant="body2" sx={{ color: textMuted, fontSize: '0.8125rem' }}>
              {na}
            </Typography>
          ) : (
            c.alternativeAddresses.map((address) => (
              <AlternativeRow
                key={address}
                value={address}
                onEdit={() => {
                  setNewAddress(address);
                  setAddressDialog(true);
                }}
              />
            ))
          )}
        </AlternativeCard>
      </Box>

      {saveState === 'success' && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {t('loanDetails.customer.saveSuccess')}
        </Alert>
      )}
      {saveState === 'error' && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {t('loanDetails.customer.saveError')}
        </Alert>
      )}

      <Dialog
        open={phoneDialog}
        onClose={() => {
          setPhoneDialog(false);
          setNewPhone({ number: '', label: '' });
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{t('loanDetails.customer.newNumber')}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label={t('loanDetails.customer.phone')}
            value={newPhone.number}
            onChange={(e) => {
              setNewPhone({ ...newPhone, number: e.target.value });
            }}
            size="small"
          />
          <TextField
            label={t('loanDetails.customer.phoneLabel')}
            value={newPhone.label}
            onChange={(e) => {
              setNewPhone({ ...newPhone, label: e.target.value });
            }}
            size="small"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setPhoneDialog(false);
              setNewPhone({ number: '', label: '' });
            }}
          >
            {t('notes.add.cancel')}
          </Button>
          <Button variant="contained" onClick={() => void handleAddPhone()}>
            {t('paymentNotices.actions.save')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={emailDialog}
        onClose={() => {
          setEmailDialog(false);
          setNewEmail('');
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{t('loanDetails.customer.newEmail')}</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <TextField
            fullWidth
            label={t('loanDetails.customer.email')}
            value={newEmail}
            onChange={(e) => {
              setNewEmail(e.target.value);
            }}
            size="small"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setEmailDialog(false);
              setNewEmail('');
            }}
          >
            {t('notes.add.cancel')}
          </Button>
          <Button variant="contained" onClick={() => void handleAddEmail()}>
            {t('paymentNotices.actions.save')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={addressDialog}
        onClose={() => {
          setAddressDialog(false);
          setNewAddress('');
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{t('loanDetails.customer.newAddress')}</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <TextField
            fullWidth
            label={t('loanDetails.customer.address')}
            value={newAddress}
            onChange={(e) => {
              setNewAddress(e.target.value);
            }}
            size="small"
            multiline
            minRows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setAddressDialog(false);
              setNewAddress('');
            }}
          >
            {t('notes.add.cancel')}
          </Button>
          <Button variant="contained" onClick={() => void handleAddAddress()}>
            {t('paymentNotices.actions.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </DetailSection>
  );
}

function CustomerFieldColumn({ children }: { children: React.ReactNode }) {
  return (
    <Stack spacing={2.5} sx={{ minWidth: 0 }}>
      {children}
    </Stack>
  );
}

function CustomerField({
  label,
  value,
  emphasis = false,
  muted = false,
}: {
  label: string;
  value: React.ReactNode;
  emphasis?: boolean;
  muted?: boolean;
}) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="microLabel" sx={{ display: 'block', mb: 0.75 }}>
        {label}
      </Typography>
      {typeof value === 'string' || typeof value === 'number' ? (
        <Typography
          variant="body2"
          sx={{
            fontWeight: emphasis ? 700 : muted ? 400 : 500,
            color: muted ? textSecondary : textPrimary,
            wordBreak: 'break-word',
            fontSize: '0.875rem',
          }}
        >
          {value}
        </Typography>
      ) : (
        <Box>{value}</Box>
      )}
    </Box>
  );
}

function AlternativeCard({
  title,
  onAdd,
  children,
}: {
  title: string;
  onAdd: () => void;
  children: React.ReactNode;
}) {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        border: `1px dashed ${borderSubtle}`,
        borderRadius: '10px',
        p: 2,
        minHeight: 88,
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
        <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500, color: textPrimary }}>
          {title}
        </Typography>
        <Button
          variant="text"
          size="small"
          onClick={onAdd}
          sx={{
            minWidth: 0,
            px: 0.5,
            py: 0,
            color: dashboardGreen,
            fontWeight: 600,
            fontSize: '0.8125rem',
            textTransform: 'none',
            '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
          }}
        >
          {t('loanDetails.customer.add')}
        </Button>
      </Stack>
      <Stack spacing={1}>{children}</Stack>
    </Box>
  );
}

function AlternativeRow({ value, onEdit }: { value: string; onEdit: () => void }) {
  const { t } = useTranslation();

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
      <Typography
        variant="body2"
        sx={{ color: textSecondary, fontSize: '0.8125rem', wordBreak: 'break-word', flex: 1 }}
      >
        {value}
      </Typography>
      <Button
        variant="text"
        size="small"
        onClick={onEdit}
        sx={{
          minWidth: 0,
          px: 0.5,
          py: 0,
          flexShrink: 0,
          color: textMuted,
          fontWeight: 400,
          fontSize: '0.8125rem',
          textTransform: 'none',
          '&:hover': { bgcolor: 'transparent', color: textSecondary },
        }}
      >
        {t('loanDetails.customer.editLink')}
      </Button>
    </Stack>
  );
}
