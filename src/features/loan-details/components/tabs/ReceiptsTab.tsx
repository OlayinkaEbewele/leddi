import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { useTranslation } from 'react-i18next';
import type { LoanDetails } from '@/api/types';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDisplayDate } from '@/utils/formatDate';
import { TabListCard } from './shared/TabListCard';

interface ReceiptsTabProps {
  loan: LoanDetails;
}

export function ReceiptsTab({ loan }: ReceiptsTabProps) {
  const { t } = useTranslation();

  if (loan.receipts.length === 0) {
    return <Alert severity="info">{t('loanDetails.empty.receipts')}</Alert>;
  }

  return (
    <Stack spacing={0}>
      {loan.receipts.map((receipt) => (
        <TabListCard
          key={receipt.id}
          icon={<DescriptionOutlinedIcon fontSize="small" />}
          title={t('loanDetails.receipts.title', { ref: receipt.reference })}
          subtitle={`${formatCurrency(receipt.amount, loan.currency)} · ${formatDisplayDate(receipt.receivedAt)}`}
          actionLabel={t('loanDetails.receipts.view')}
          onAction={() => {
            window.open(`#receipt/${receipt.id}`, '_blank');
          }}
        />
      ))}
    </Stack>
  );
}
