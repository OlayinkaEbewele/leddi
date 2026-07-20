import { useTranslation } from 'react-i18next';
import type { LoanDetails } from '@/api/types';
import { ValueTag } from '@/components/ValueTag';
import { DetailSection } from './DetailSection';
import { FieldGrid, type FieldGridItem } from './FieldGrid';

interface LoanCommercialsSectionProps {
  loan: LoanDetails;
  embedded?: boolean;
}

export function LoanCommercialsSection({ loan, embedded }: LoanCommercialsSectionProps) {
  const { t } = useTranslation();
  const c = loan.loanCommercials;

  const fields: FieldGridItem[] = [
    {
      label: t('loanDetails.commercials.migrated'),
      value: <ValueTag value={c.migrated ? t('common.yes') : t('common.no')} />,
    },
    { label: t('loanDetails.commercials.interestRate'), value: `${c.interestRate}%` },
    { label: t('loanDetails.commercials.interestType'), value: <ValueTag value={c.interestType} /> },
    { label: t('loanDetails.commercials.structureCode'), value: <ValueTag value={c.structureCode} /> },
    {
      label: t('loanDetails.commercials.loanTerm'),
      value: `${c.loanTermMonths} ${t('loanDetails.commercials.months')}`,
    },
    {
      label: t('loanDetails.commercials.remainingTerm'),
      value: `${c.remainingTermMonths} ${t('loanDetails.commercials.months')}`,
    },
  ];

  return (
    <DetailSection title={t('loanDetails.sections.commercials')} embedded={embedded}>
      <FieldGrid fields={fields} />
    </DetailSection>
  );
}
