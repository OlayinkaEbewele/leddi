// TODO(confirm columns): patch v0.2 §7.7 — exact column spec TBD; placeholder columns below
import type { GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { PlaceholderTabKey } from '@/api';
import type { PlaceholderTabRow } from '@/api/types';
import { PrimeDataGrid } from '@/components/PrimeDataGrid';
import { ValueTag } from '@/components/ValueTag';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDateTime } from '@/utils/formatDate';
import { usePlaceholderTabQuery } from '../hooks/usePlaceholderTabQuery';
import type { GlobalFiltersState } from '../types/filters';

const TAB_I18N: Record<PlaceholderTabKey, string> = {
  PTP: 'loans.tabs.ptp',
  RESTRUCTURE: 'loans.tabs.restructure',
  STATUS_UPDATES: 'loans.tabs.statusUpdates',
  SETTLED_DEALS: 'loans.tabs.settledDeals',
  DEAL_ADMIN_REQUESTS: 'loans.tabs.dealAdminRequests',
};

interface PlaceholderTabPanelProps {
  tab: PlaceholderTabKey;
  globalFilters: GlobalFiltersState;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
}

export function PlaceholderTabPanel({
  tab,
  globalFilters,
  paginationModel,
  onPaginationModelChange,
}: PlaceholderTabPanelProps) {
  const { t } = useTranslation();

  const query = useMemo(
    () => ({
      page: paginationModel.page + 1,
      pageSize: paginationModel.pageSize,
      country: globalFilters.country || undefined,
      dateRange:
        globalFilters.dateFrom || globalFilters.dateTo
          ? { from: globalFilters.dateFrom, to: globalFilters.dateTo }
          : undefined,
    }),
    [paginationModel, globalFilters],
  );

  const { data, isLoading, isFetching } = usePlaceholderTabQuery(tab, query);

  const columns = useMemo<GridColDef<PlaceholderTabRow>[]>(
    () => [
      { field: 'acquireId', headerName: t('loans.columns.acquireId'), width: 120 },
      { field: 'customerName', headerName: t('loans.columns.customerName'), width: 160 },
      {
        field: 'amount',
        headerName: t('placeholder.columns.amount'),
        width: 120,
        valueFormatter: (_value, row) =>
          row.amount != null ? formatCurrency(row.amount, row.currency) : '—',
      },
      {
        field: 'status',
        headerName: t('placeholder.columns.status'),
        width: 120,
        renderCell: ({ value }) => <ValueTag value={String(value)} />,
      },
      {
        field: 'createdAt',
        headerName: t('placeholder.columns.createdAt'),
        width: 150,
        valueFormatter: (v) => formatDateTime(String(v)),
      },
      { field: 'extraField', headerName: t('placeholder.columns.notes'), width: 180 },
    ],
    [t],
  );

  return (
    <PrimeDataGrid
      rows={data?.items ?? []}
      columns={columns}
      rowCount={data?.totalCount ?? 0}
      loading={isLoading || isFetching}
      paginationModel={paginationModel}
      onPaginationModelChange={onPaginationModelChange}
      getRowId={(row) => row.id}
      emptyMessage={t('placeholder.empty')}
      ariaLabel={t(TAB_I18N[tab])}
    />
  );
}
