import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { GridPaginationModel } from '@mui/x-data-grid';
import { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { isCountryFilterAdmin } from '@/auth/roles';
import { useCurrentUser } from '@/auth/UserContext';
import { PrimeTopBar } from '@/components/PrimeTopBar';
import { pagePadding } from '@/theme/theme';
import { isIfrsFilterActive } from '@/utils/ifrsFilter';
import { GlobalFilterBar } from './components/GlobalFilterBar';
import { LoansLocalFilters } from './components/LoansLocalFilters';
import { LoansTabPanel } from './components/LoansTabPanel';
import { PaymentNoticesTabPanel } from './components/PaymentNoticesTabPanel';
import { PlaceholderTabPanel } from './components/PlaceholderTabPanel';
import { PrimeTabStrip } from './components/PrimeTabStrip';
import { StatusUpdatesTabPanel } from './components/StatusUpdatesTabPanel';
import { useLoansQuery } from './hooks/useLoansQuery';
import { applyDashboardBucketParams, resolveTabFromSearchParam } from './utils/loansListUrlParams';
import {
  EMPTY_GLOBAL_FILTERS,
  EMPTY_LOANS_LOCAL_FILTERS,
  type GlobalFiltersState,
  type LoansLocalFiltersState,
} from './types/filters';

export function LoansListPage() {
  const { t } = useTranslation();
  const user = useCurrentUser();
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(() => resolveTabFromSearchParam(searchParams.get('activeTab')));

  const [globalFilters, setGlobalFilters] = useState<GlobalFiltersState>(() => {
    const base: GlobalFiltersState = {
      ...EMPTY_GLOBAL_FILTERS,
      country: isCountryFilterAdmin(user.roles) ? '' : user.country,
    };
    const bucket = searchParams.get('bucket');
    if (bucket === 'missedPayment') {
      return { ...base, statuses: ['MISSEDPAYMENT'] };
    }
    return base;
  });

  const [loansLocalFilters, setLoansLocalFilters] = useState<LoansLocalFiltersState>(() => {
    const base: LoansLocalFiltersState = {
      ...EMPTY_LOANS_LOCAL_FILTERS,
      searchTerm: searchParams.get('search') ?? '',
    };
    const bucket = searchParams.get('bucket');
    const applied = applyDashboardBucketParams(bucket, EMPTY_GLOBAL_FILTERS, base);
    return applied.localFilters;
  });

  useEffect(() => {
    const search = searchParams.get('search');
    if (search) {
      setLoansLocalFilters((prev) => ({ ...prev, searchTerm: search, searchBy: 'customer' }));
    }

    const activeTab = searchParams.get('activeTab');
    if (activeTab) {
      setTab(resolveTabFromSearchParam(activeTab));
    }

    const bucket = searchParams.get('bucket');
    if (bucket) {
      setGlobalFilters(
        (prev) => applyDashboardBucketParams(bucket, prev, EMPTY_LOANS_LOCAL_FILTERS).globalFilters,
      );
      setLoansLocalFilters(
        (prev) => applyDashboardBucketParams(bucket, EMPTY_GLOBAL_FILTERS, prev).localFilters,
      );
    }
  }, [searchParams]);

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 11,
  });

  const loansQuery = useMemo(
    () => ({
      page: paginationModel.page + 1,
      pageSize: paginationModel.pageSize,
      searchTerm: loansLocalFilters.searchTerm || undefined,
      searchBy: loansLocalFilters.searchTerm ? loansLocalFilters.searchBy : undefined,
      ifrsFilter: isIfrsFilterActive(loansLocalFilters.ifrsFilter)
        ? loansLocalFilters.ifrsFilter
        : undefined,
      demandNoticeFilter: loansLocalFilters.demandNoticeFilter || undefined,
      country: globalFilters.country || undefined,
      classification: globalFilters.classification || undefined,
      structureCode: globalFilters.structureCode || undefined,
      statuses: globalFilters.statuses.length ? globalFilters.statuses : undefined,
      loanCategory: globalFilters.loanCategory || undefined,
      dateRange:
        globalFilters.dateFrom || globalFilters.dateTo
          ? { from: globalFilters.dateFrom, to: globalFilters.dateTo }
          : undefined,
    }),
    [paginationModel, loansLocalFilters, globalFilters],
  );

  const { data, isLoading, isFetching, isError, refetch } = useLoansQuery(loansQuery);

  const handleGlobalFiltersChange = (next: GlobalFiltersState) => {
    setGlobalFilters(next);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const handleLoansLocalFiltersChange = (next: LoansLocalFiltersState) => {
    setLoansLocalFilters(next);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const handleTabChange = (index: number) => {
    setTab(index);
    setPaginationModel({
      page: 0,
      pageSize: index === 4 ? 4 : 11,
    });
  };

  const placeholderTabKey =
    tab === 2
      ? 'PTP'
      : tab === 3
        ? 'RESTRUCTURE'
        : tab === 5
          ? 'SETTLED_DEALS'
          : tab === 6
            ? 'DEAL_ADMIN_REQUESTS'
            : null;

  return (
    <Box sx={{ p: pagePadding }}>
      <PrimeTopBar />

      <Typography variant="h5" gutterBottom>
        {t('loans.title')}
      </Typography>

      <GlobalFilterBar value={globalFilters} onChange={handleGlobalFiltersChange} />

      <PrimeTabStrip
        value={tab}
        onChange={handleTabChange}
        tabCounts={{ loans: data?.totalCount }}
      />

      {tab === 0 && (
        <>
          <LoansLocalFilters
            value={loansLocalFilters}
            onChange={handleLoansLocalFiltersChange}
            onSearch={() => void refetch()}
            onReload={() => void refetch()}
            isReloading={isFetching}
          />
          <LoansTabPanel
            rows={data?.items ?? []}
            rowCount={data?.totalCount ?? 0}
            loading={isLoading || isFetching}
            isError={isError}
            isReloading={isFetching}
            onRetry={() => void refetch()}
            onReload={() => void refetch()}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </>
      )}

      {tab === 1 && (
        <PaymentNoticesTabPanel
          globalFilters={globalFilters}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
      )}

      {tab === 4 && (
        <StatusUpdatesTabPanel
          globalFilters={globalFilters}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
      )}

      {placeholderTabKey && (
        <PlaceholderTabPanel
          tab={placeholderTabKey}
          globalFilters={globalFilters}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
      )}
    </Box>
  );
}
