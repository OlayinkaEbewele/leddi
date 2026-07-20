import { useTranslation } from 'react-i18next';
import type { LoanDetails } from '@/api/types';
import { ValueTag } from '@/components/ValueTag';
import { DetailSection } from './DetailSection';
import { FieldGrid, type FieldGridItem } from './FieldGrid';

interface AccountManagerSectionProps {
  loan: LoanDetails;
  embedded?: boolean;
}

export function AccountManagerSection({ loan, embedded }: AccountManagerSectionProps) {
  const { t } = useTranslation();
  const am = loan.accountManager;
  const na = t('loanDetails.notAvailable');

  const fields: FieldGridItem[] = [
    { label: t('loanDetails.accountManager.name'), value: am?.name ?? na },
    { label: t('loanDetails.accountManager.email'), value: am?.email ?? na },
    {
      label: t('loanDetails.accountManager.territory'),
      value: am?.territory ? <ValueTag value={am.territory} /> : na,
    },
    { label: t('loanDetails.accountManager.supervisor'), value: am?.territorySupervisor ?? na },
  ];

  return (
    <DetailSection title={t('loanDetails.sections.accountManager')} embedded={embedded}>
      <FieldGrid fields={fields} />
    </DetailSection>
  );
}
