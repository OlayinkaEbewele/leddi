import type { GridCellParams } from '@mui/x-data-grid';
import type { LoanListItem } from '@/api/types';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDisplayDate } from '@/utils/formatDate';

const NON_COPYABLE_FIELDS = new Set(['actions']);

export function getLoanListCellCopyValue(
  params: GridCellParams<LoanListItem>,
): string | null {
  const { field, row, value, formattedValue } = params;

  if (NON_COPYABLE_FIELDS.has(field)) {
    return null;
  }

  if (formattedValue != null && formattedValue !== '') {
    return String(formattedValue);
  }

  switch (field) {
    case 'operationalStatus':
      return row.operationalStatus.status;
    case 'ifrsStatus':
      return row.ifrsStatus === null ? null : String(row.ifrsStatus);
    case 'demandNoticeDate':
      return row.demandNoticeDate ? formatDisplayDate(row.demandNoticeDate) : null;
    case 'arrearsBalance':
    case 'capitalBalance':
    case 'totalExposure':
      return formatCurrency(Number(value), row.currency);
    case 'nextInstallmentDate':
    case 'inceptionDate':
    case 'maturityDate':
      return value ? formatDisplayDate(String(value)) : null;
    default:
      if (value == null || value === '') {
        return null;
      }
      if (typeof value === 'object') {
        return null;
      }
      return String(value);
  }
}
