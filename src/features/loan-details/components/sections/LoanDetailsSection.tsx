import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import type { LoanDetails } from '@/api/types';
import { CurrencyAmountDisplay } from '@/components/CurrencyAmountDisplay';
import { ValueTag } from '@/components/ValueTag';
import { formatDisplayDate } from '@/utils/formatDate';
import { dashboardGreen, riskStage1 } from '@/theme/theme';
import { DetailSection } from './DetailSection';
import { FieldGrid, type FieldGridItem } from './FieldGrid';

interface LoanDetailsSectionProps {
  loan: LoanDetails;
  embedded?: boolean;
}

function ptpRateColor(rate: number): string {
  if (rate >= 80) return riskStage1;
  if (rate >= 50) return dashboardGreen;
  return '#B83A3A';
}

export function LoanDetailsSection({ loan, embedded }: LoanDetailsSectionProps) {
  const { t } = useTranslation();

  const headerAction = !embedded ? (
    <Typography sx={{ fontWeight: 700, fontSize: '0.8125rem', color: ptpRateColor(loan.ptpRate) }}>
      {t('loanDetails.loan.ptpRate')} {loan.ptpRate}%
    </Typography>
  ) : undefined;

  const fields: FieldGridItem[] = [
    { label: t('loans.columns.acquireId'), value: loan.acquireId },
    { label: t('loanDetails.loan.originationId'), value: loan.originationId },
    { label: t('loans.columns.classification'), value: <ValueTag value={loan.classification} /> },
    { label: t('loans.columns.maturityDate'), value: formatDisplayDate(loan.maturityDate) },
    {
      label: t('loanDetails.loan.lastStatusChange'),
      value: formatDisplayDate(loan.lastStatusChangeDate),
    },
    { label: t('loans.columns.loandiskId'), value: loan.loandiskId },
    { label: t('loanDetails.loan.source'), value: <ValueTag value={loan.source} /> },
    { label: t('loans.columns.inceptionDate'), value: formatDisplayDate(loan.inceptionDate) },
    {
      label: t('loanDetails.loan.residualBalance'),
      value: <CurrencyAmountDisplay amount={loan.residualBalance} currency={loan.currency} />,
    },
  ];

  return (
    <DetailSection title={t('loanDetails.sections.loan')} headerAction={headerAction} embedded={embedded}>
      <FieldGrid fields={fields} />
    </DetailSection>
  );
}
