import { useTranslation } from 'react-i18next';
import type { LoanDetails } from '@/api/types';
import { CurrencyAmountDisplay } from '@/components/CurrencyAmountDisplay';
import { IfrsStatusBadge } from '@/components/IfrsStatusBadge';
import { ValueTag } from '@/components/ValueTag';
import { formatDisplayDate } from '@/utils/formatDate';
import { formatOrdinal } from '@/utils/formatOrdinal';
import { DetailSection } from './DetailSection';
import { FieldGrid, type FieldGridItem } from './FieldGrid';

interface RepaymentInfoSectionProps {
  loan: LoanDetails;
  embedded?: boolean;
}

export function RepaymentInfoSection({ loan, embedded }: RepaymentInfoSectionProps) {
  const { t } = useTranslation();
  const r = loan.repaymentInfo;

  const fields: FieldGridItem[] = [
    {
      label: t('loans.columns.ifrsStage'),
      value: <IfrsStatusBadge value={r.ifrsStatus} variant="detail" />,
    },
    { label: t('loanDetails.repayment.nextInstallment'), value: formatDisplayDate(r.nextInstallmentDate) },
    {
      label: t('loanDetails.repayment.installment'),
      value: <CurrencyAmountDisplay amount={r.installmentAmount} currency={loan.currency} />,
    },
    {
      label: t('loans.columns.capitalBalance'),
      value: <CurrencyAmountDisplay amount={r.capitalBalance} currency={loan.currency} />,
    },
    {
      label: t('loans.columns.totalExposure'),
      value: <CurrencyAmountDisplay amount={r.totalExposure} currency={loan.currency} />,
    },
    {
      label: t('loanDetails.repayment.firstInstallment'),
      value: formatDisplayDate(r.firstInstallmentDate),
    },
    { label: t('loanDetails.repayment.installmentDay'), value: formatOrdinal(r.installmentDay) },
    {
      label: t('loanDetails.header.arrears'),
      value: <CurrencyAmountDisplay amount={r.arrearsBalance} currency={loan.currency} negative />,
    },
    {
      label: t('loanDetails.repayment.daysInArrears'),
      value: `${r.daysInArrears} ${r.daysInArrears === 1 ? t('loanDetails.repayment.day') : t('loanDetails.repayment.days')}`,
    },
    {
      label: t('loanDetails.repayment.lastDemandNotice'),
      value: r.lastDemandNoticeDate ? (
        <ValueTag value="Sent" />
      ) : (
        '—'
      ),
    },
  ];

  return (
    <DetailSection title={t('loanDetails.sections.repayment')} embedded={embedded}>
      <FieldGrid fields={fields} />
    </DetailSection>
  );
}
