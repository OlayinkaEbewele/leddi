import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { LoanDetails } from '@/api/types';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDisplayDate } from '@/utils/formatDate';
import { formatRelativeOrAbsolute } from '@/utils/formatRelativeTime';
import { CapturePtpModal } from '../modals/CapturePtpModal';
import { PtpStatusBadge } from './shared/PtpStatusBadge';
import { TabDataTable } from './shared/TabDataTable';

interface PromisesTabProps {
  loan: LoanDetails;
  onReload: () => void;
  onCapturePtp: (ptp: { amount: number; promisedDate: string }) => Promise<void>;
  isCapturing: boolean;
}

export function PromisesTab({ loan, onReload, onCapturePtp, isCapturing }: PromisesTabProps) {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);

  const columns = [
    { id: 'id', label: 'ID' },
    { id: 'capturedBy', label: t('loanDetails.promises.capturedBy') },
    { id: 'dueDate', label: t('loanDetails.promises.dueDate') },
    { id: 'amount', label: t('loanDetails.promises.promisedAmount'), boldHeader: true },
    { id: 'status', label: t('loanDetails.promises.ptpStatus') },
    { id: 'statusTime', label: t('loanDetails.promises.statusTime') },
  ];

  return (
    <>
      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon sx={{ fontSize: 16 }} />}
          onClick={() => {
            setModalOpen(true);
          }}
        >
          {t('loanDetails.promises.capture')}
        </Button>
      </Stack>

      {loan.ptps.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          {t('loanDetails.empty.ptps')}
        </Typography>
      ) : (
        <TabDataTable columns={columns}>
          {loan.ptps.map((ptp) => (
            <TableRow key={ptp.id} hover>
              <TableCell sx={{ fontSize: '0.8125rem' }}>{ptp.id}</TableCell>
              <TableCell sx={{ fontSize: '0.8125rem' }}>{ptp.capturedBy}</TableCell>
              <TableCell sx={{ fontSize: '0.8125rem' }}>
                {formatDisplayDate(ptp.promisedDate)}
              </TableCell>
              <TableCell sx={{ fontSize: '0.8125rem', fontWeight: 700 }}>
                {formatCurrency(ptp.amount, loan.currency)}
              </TableCell>
              <TableCell>
                <PtpStatusBadge status={ptp.status} />
              </TableCell>
              <TableCell sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>
                {formatRelativeOrAbsolute(ptp.statusTime)}
              </TableCell>
            </TableRow>
          ))}
        </TabDataTable>
      )}

      <CapturePtpModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
        isSubmitting={isCapturing}
        onSubmit={async (data) => {
          await onCapturePtp(data);
          setModalOpen(false);
          onReload();
        }}
      />
    </>
  );
}
