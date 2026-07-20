import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import type { LoanDetails } from '@/api/types';
import { CurrencyAmountDisplay } from '@/components/CurrencyAmountDisplay';
import { PaymentHistoryMonthTags } from '@/components/PaymentHistoryMonthTags';
import { ValueTag } from '@/components/ValueTag';
import { formatDisplayDate } from '@/utils/formatDate';
import { DetailSection } from './DetailSection';
import {
  FieldGridCell,
  StatusesDivider,
  StatusesGrid,
} from './detailSectionLayout';

interface StatusesSectionProps {
  loan: LoanDetails;
}

export function StatusesSection({ loan }: StatusesSectionProps) {
  const { t } = useTranslation();

  return (
    <DetailSection title={t('loanDetails.sections.statuses')}>
      <StatusesGrid>
        <FieldGridCell label={t('loanDetails.statuses.operationalStatus')}>
          <ValueTag value={loan.operationalStatus.status} />
        </FieldGridCell>
        <FieldGridCell label={t('loanDetails.statuses.dealStatus')}>
          <ValueTag value={loan.dealStatus} />
        </FieldGridCell>
        <FieldGridCell label={t('loanDetails.statuses.loanCategory')}>
          <ValueTag value={loan.loanCategory} />
        </FieldGridCell>

        <StatusesDivider />

        <Box sx={{ gridColumn: '1 / -1' }}>
          {loan.paymentHistory.length > 0 ? (
            <PaymentHistoryMonthTags
              months={loan.paymentHistory}
              caption={t('loanDetails.statuses.paymentHistoryCaption')}
            />
          ) : (
            <Typography variant="body2" color="text.secondary">
              {t('loanDetails.statuses.noPaymentHistory')}
            </Typography>
          )}
        </Box>

        <FieldGridCell label={t('loanDetails.statuses.lastPayment')}>
          <CurrencyAmountDisplay
            amount={loan.lastPaymentAmount}
            currency={loan.currency}
            secondary={formatDisplayDate(loan.lastPaymentDate)}
          />
        </FieldGridCell>
        <FieldGridCell label={t('loanDetails.statuses.arrearsBalance')}>
          <CurrencyAmountDisplay
            amount={loan.arrearsBalance}
            currency={loan.currency}
            negative
          />
        </FieldGridCell>
        <FieldGridCell label={t('loanDetails.statuses.totalPaid')}>
          <CurrencyAmountDisplay amount={loan.totalPaid} currency={loan.currency} />
        </FieldGridCell>
      </StatusesGrid>
    </DetailSection>
  );
}
