import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import type { GridPaginationModel } from '@mui/x-data-grid';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { statusUpdatesApi } from '@/api';
import type { StatusUpdateRequest, StatusUpdatesListQuery } from '@/api/types';
import { RefreshCwIcon, SearchIcon } from '@/components/animate-ui-icons';
import { tokenVars } from '@/theme/cssVars';
import { borderSubtle, pageBackground, textSecondary } from '@/theme/theme';
import {
  usePendingStatusUpdatesQuery,
  useStatusAuditTrailQuery,
} from '../hooks/useStatusUpdatesQuery';
import type { GlobalFiltersState } from '../types/filters';
import { LoansListPagination } from './LoansListPagination';
import {
  StatusUpdateConfirmDialog,
  StatusUpdateRejectDialog,
} from './StatusUpdateActionDialogs';
import { StatusUpdateAuditCard } from './StatusUpdateAuditCard';
import {
  StatusUpdateRequestCard,
  StatusUpdatesGridToggle,
} from './StatusUpdateRequestCard';

interface StatusUpdatesTabPanelProps {
  globalFilters: GlobalFiltersState;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
}

type PendingAction =
  | { type: 'confirm'; request: StatusUpdateRequest }
  | { type: 'reject'; request: StatusUpdateRequest }
  | null;

function pageSizeForColumns(columns: 2 | 3): number {
  return columns * 3;
}

export function StatusUpdatesTabPanel({
  globalFilters,
  paginationModel,
  onPaginationModelChange,
}: StatusUpdatesTabPanelProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [subTab, setSubTab] = useState(0);
  const [acquireIdSearch, setAcquireIdSearch] = useState('');
  const [appliedAcquireId, setAppliedAcquireId] = useState('');
  const [gridColumns, setGridColumns] = useState<2 | 3>(3);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [actingOnId, setActingOnId] = useState<string | null>(null);

  const query = useMemo<StatusUpdatesListQuery>(
    () => ({
      page: paginationModel.page + 1,
      pageSize: paginationModel.pageSize,
      acquireId: appliedAcquireId || undefined,
      dateRange:
        globalFilters.dateFrom || globalFilters.dateTo
          ? { from: globalFilters.dateFrom, to: globalFilters.dateTo }
          : undefined,
    }),
    [paginationModel, appliedAcquireId, globalFilters],
  );

  const pendingQuery = usePendingStatusUpdatesQuery(query);
  const auditQuery = useStatusAuditTrailQuery(query);

  const isPendingView = subTab === 0;
  const activeQuery = isPendingView ? pendingQuery : auditQuery;
  const { isLoading, isFetching, isError, refetch } = activeQuery;
  const pendingItems = pendingQuery.data?.items ?? [];
  const auditItems = auditQuery.data?.items ?? [];
  const totalCount = activeQuery.data?.totalCount ?? 0;
  const hasItems = isPendingView ? pendingItems.length > 0 : auditItems.length > 0;
  const skeletonCount = pageSizeForColumns(gridColumns);

  const invalidate = () => void queryClient.invalidateQueries({ queryKey: ['statusUpdates'] });

  const confirmMutation = useMutation({
    mutationFn: (id: string) => statusUpdatesApi.confirmRequest(id),
    onSuccess: () => {
      invalidate();
      setPendingAction(null);
      setActingOnId(null);
    },
    onError: () => {
      setActingOnId(null);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => statusUpdatesApi.rejectRequest(id),
    onSuccess: () => {
      invalidate();
      setPendingAction(null);
      setActingOnId(null);
    },
    onError: () => {
      setActingOnId(null);
    },
  });

  const isSubmitting = confirmMutation.isPending || rejectMutation.isPending;

  const handleSearch = () => {
    setAppliedAcquireId(acquireIdSearch.trim());
    onPaginationModelChange({ ...paginationModel, page: 0 });
  };

  const handleSubTabChange = (index: number) => {
    setSubTab(index);
    onPaginationModelChange({ ...paginationModel, page: 0 });
  };

  const handleGridColumnsChange = (columns: 2 | 3) => {
    setGridColumns(columns);
    onPaginationModelChange({
      page: 0,
      pageSize: pageSizeForColumns(columns),
    });
  };

  const handleConfirmSubmit = () => {
    if (!pendingAction || pendingAction.type !== 'confirm') return;
    setActingOnId(pendingAction.request.id);
    void confirmMutation.mutateAsync(pendingAction.request.id);
  };

  const handleRejectSubmit = () => {
    if (!pendingAction || pendingAction.type !== 'reject') return;
    setActingOnId(pendingAction.request.id);
    void rejectMutation.mutateAsync(pendingAction.request.id);
  };

  const handleReload = () => {
    void refetch();
    if (isFetching) {
      // animate while fetching
    }
  };

  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr auto auto auto' },
          gap: 1.5,
          alignItems: 'center',
          mb: 2,
        }}
      >
        <TextField
          size="small"
          label={t('statusUpdates.filters.acquireId')}
          placeholder={t('loans.localFilters.searchPlaceholder')}
          value={acquireIdSearch}
          onChange={(e) => setAcquireIdSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch();
          }}
          sx={{ width: '100%', minWidth: 0 }}
        />
        <Button
          variant="contained"
          size="small"
          startIcon={<SearchIcon size={18} animateOnHover />}
          onClick={handleSearch}
          sx={{ py: 1, px: 2, whiteSpace: 'nowrap' }}
        >
          {t('loans.localFilters.search')}
        </Button>
        <StatusUpdatesGridToggle columns={gridColumns} onChange={handleGridColumnsChange} />
        <Button
          variant="outlined"
          size="small"
          startIcon={
            <RefreshCwIcon
              size={18}
              animate={isFetching}
              animation="rotate"
              loop
              animateOnHover
            />
          }
          onClick={handleReload}
          disabled={isFetching}
          sx={{ py: 1, px: 2, whiteSpace: 'nowrap' }}
        >
          {t('loans.reload')}
        </Button>
      </Box>

      <Tabs
        value={subTab}
        onChange={(_, v: number) => handleSubTabChange(v)}
        sx={{
          mb: 2.5,
          minHeight: 48,
          borderBottom: `1px solid ${borderSubtle}`,
          px: 1.5,
          pt: 1,
          pb: 0.5,
          bgcolor: pageBackground,
          '& .MuiTab-root': {
            mx: 0.25,
            px: 2,
            py: 0.75,
            minHeight: 36,
            borderRadius: '20px',
            color: textSecondary,
            fontWeight: 600,
            fontSize: '0.8125rem',
            textTransform: 'none',
            bgcolor: 'transparent',
          },
          '& .MuiTab-root.Mui-selected': {
            color: '#FFFFFF !important',
            bgcolor: `${tokenVars.accent} !important`,
          },
          '& .MuiTab-root.Mui-selected:hover': {
            color: '#FFFFFF !important',
            bgcolor: `${tokenVars.accentHover} !important`,
          },
          '& .MuiTabs-indicator': { display: 'none' },
        }}
      >
        <Tab label={t('statusUpdates.subTabs.pending')} />
        <Tab label={t('statusUpdates.subTabs.auditTrail')} />
      </Tabs>

      {isError && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => void refetch()}>
              {t('loans.retry')}
            </Button>
          }
          sx={{ mb: 2 }}
        >
          {t('loans.error')}
        </Alert>
      )}

      {isLoading && !hasItems ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: `repeat(${gridColumns}, 1fr)`,
            },
            gap: 2,
          }}
        >
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={280} sx={{ borderRadius: '14px' }} />
          ))}
        </Box>
      ) : !isLoading && !hasItems ? (
        <Alert severity="info">{t('statusUpdates.empty')}</Alert>
      ) : (
        <>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: `repeat(${gridColumns}, 1fr)`,
              },
              gap: 2,
              mb: 2,
            }}
          >
            {isPendingView
              ? pendingItems.map((request) => (
                  <StatusUpdateRequestCard
                    key={request.id}
                    request={request}
                    onConfirm={() => setPendingAction({ type: 'confirm', request })}
                    onReject={() => setPendingAction({ type: 'reject', request })}
                  />
                ))
              : auditItems.map((entry) => (
                  <StatusUpdateAuditCard key={entry.id} entry={entry} />
                ))}
          </Box>

          <LoansListPagination
            page={paginationModel.page}
            pageSize={paginationModel.pageSize}
            totalCount={totalCount}
            onPageChange={(page) => {
              onPaginationModelChange({ ...paginationModel, page });
            }}
          />
        </>
      )}

      <StatusUpdateConfirmDialog
        open={pendingAction?.type === 'confirm'}
        request={pendingAction?.type === 'confirm' ? pendingAction.request : null}
        loading={isSubmitting && actingOnId === pendingAction?.request.id}
        onClose={() => {
          if (!isSubmitting) setPendingAction(null);
        }}
        onConfirm={handleConfirmSubmit}
      />

      <StatusUpdateRejectDialog
        open={pendingAction?.type === 'reject'}
        request={pendingAction?.type === 'reject' ? pendingAction.request : null}
        loading={isSubmitting && actingOnId === pendingAction?.request.id}
        onClose={() => {
          if (!isSubmitting) setPendingAction(null);
        }}
        onReject={handleRejectSubmit}
      />
    </>
  );
}
