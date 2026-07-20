import Alert from '@mui/material/Alert';
import { useTranslation } from 'react-i18next';
import type { LoanDetails } from '@/api/types';
import { CurrencyAmountDisplay } from '@/components/CurrencyAmountDisplay';
import { ValueTag } from '@/components/ValueTag';
import { DetailSection } from './DetailSection';
import { FieldGrid, type FieldGridItem } from './FieldGrid';

interface CarDetailsSectionProps {
  loan: LoanDetails;
  embedded?: boolean;
}

export function CarDetailsSection({ loan, embedded }: CarDetailsSectionProps) {
  const { t } = useTranslation();

  if (!loan.carDetails) {
    return (
      <DetailSection title={t('loanDetails.sections.car')} embedded={embedded}>
        <Alert severity="info">{t('loanDetails.empty.car')}</Alert>
      </DetailSection>
    );
  }

  const c = loan.carDetails;

  const fields: FieldGridItem[] = [
    { label: t('loanDetails.car.carId'), value: c.carId },
    { label: t('loanDetails.car.car'), value: c.car },
    { label: t('loanDetails.car.vin'), value: c.vin },
    {
      label: t('loanDetails.car.value'),
      value: <CurrencyAmountDisplay amount={c.value} currency={loan.currency} />,
    },
    { label: t('loanDetails.car.bodyType'), value: <ValueTag value={c.bodyType} /> },
    { label: t('loanDetails.car.regNumber'), value: c.regNumber },
  ];

  return (
    <DetailSection title={t('loanDetails.sections.car')} embedded={embedded}>
      <FieldGrid fields={fields} />
    </DetailSection>
  );
}
