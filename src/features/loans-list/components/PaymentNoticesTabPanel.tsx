import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Snackbar from '@mui/material/Snackbar';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import type { GridPaginationModel } from '@mui/x-data-grid';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentNoticesApi } from '@/api';
import type { PaymentNotice, PaymentNoticesListQuery } from '@/api/types';
import { PlusIcon, RefreshCwIcon } from '@/components/animate-ui-icons';
import { tokenVars } from '@/theme/cssVars';
import { borderSubtle, pageBackground, textSecondary } from '@/theme/theme';
import { usePaymentNoticesQuery } from '../hooks/usePaymentNoticesQuery';
import {
  EMPTY_PAYMENT_NOTICES_LOCAL_FILTERS,
  type GlobalFiltersState,
  type PaymentNoticesLocalFiltersState,
} from '../types/filters';
import { AddPaymentRequestModal } from './AddPaymentRequestModal';
import { LoansListPagination } from './LoansListPagination';
import {
  ConfirmAllocateDialog,
  DeleteRecordDialog,
  EditNoticeDialog,
} from './PaymentNoticeActionDialogs';
import { PaymentNoticeCard } from './PaymentNoticeCard';
import { PaymentNoticesLocalFilters } from './PaymentNoticesLocalFilters';
import { StatusUpdatesGridToggle } from './StatusUpdateRequestCard';

interface PaymentNoticesTabPanelProps {
  globalFilters: GlobalFiltersState;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
}

type PendingAction =
  | { type: 'confirm'; notice: PaymentNotice }
  | { type: 'delete'; notice: PaymentNotice }
  | { type: 'edit'; notice: PaymentNotice }
  | null;

function pageSizeForColumns(columns: 2 | 3): number {
  return columns * 3;
}

export function PaymentNoticesTabPanel({
  globalFilters,
  paginationModel,
  onPaginationModelChange,
}: PaymentNoticesTabPanelProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [subTab, setSubTab] = useState(0);
  const [localFilters, setLocalFilters] = useState<PaymentNoticesLocalFiltersState>(
    EMPTY_PAYMENT_NOTICES_LOCAL_FILTERS,
  );
  const [addRequestOpen, setAddRequestOpen] = useState(false);
  const [downloadSnackbar, setDownloadSnackbar] = useState(false);
  const [gridColumns, setGridColumns] = useState<2 | 3>(3);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [actingOnId, setActingOnId] = useState<string | null>(null);

  const allocationStatus = subTab === 0 ? 'PENDING' : 'ALLOCATED';

  const query = useMemo<PaymentNoticesListQuery>(
    () => ({
      page: paginationModel.page + 1,
      pageSize: paginationModel.pageSize,
      allocationStatus,
      country: globalFilters.country || undefined,
      dateRange:
        globalFilters.dateFrom || globalFilters.dateTo
          ? { from: globalFilters.dateFrom, to: globalFilters.dateTo }
          : undefined,
      searchTerm: localFilters.searchTerm || undefined,
      searchBy: localFilters.searchTerm ? localFilters.searchBy : undefined,
      product: localFilters.productFilter || undefined,
      postingType: localFilters.postingTypeFilter || undefined,
    }),
    [paginationModel, allocationStatus, globalFilters, localFilters],
  );

  const { data, isLoading, isFetching, isError, refetch } = usePaymentNoticesQuery(query);
  const items = data?.items ?? [];
  const totalCount = data?.totalCount ?? 0;
  const hasItems = items.length > 0;
  const skeletonCount = pageSizeForColumns(gridColumns);

  const invalidate = () => void queryClient.invalidateQueries({ queryKey: ['paymentNotices'] });

  const confirmMutation = useMutation({
    mutationFn: (id: string) => paymentNoticesApi.confirmPaymentNotice(id),
    onSuccess: () => {
      invalidate();
      setPendingAction(null);
      setActingOnId(null);
    },
    onError: () => {
      setActingOnId(null);
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => paymentNoticesApi.deletePaymentNotice(id),
    onSuccess: () => {
      invalidate();
      setPendingAction(null);
      setActingOnId(null);
    },
    onError: () => {
      setActingOnId(null);
    },
  });
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      patch,
    }: {
      id: string;
      patch: Partial<Pick<PaymentNotice, 'amount' | 'narrative' | 'reference' | 'type'>>;
    }) => paymentNoticesApi.updatePaymentNoticeDetails(id, patch),
    onSuccess: () => {
      invalidate();
      setPendingAction(null);
      setActingOnId(null);
    },
    onError: () => {
      setActingOnId(null);
    },
  });

  const isSubmitting =
    confirmMutation.isPending || deleteMutation.isPending || updateMutation.isPending;

  const handleLocalFiltersChange = (next: PaymentNoticesLocalFiltersState) => {
    setLocalFilters(next);
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
    setActingOnId(pendingAction.notice.id);
    void confirmMutation.mutateAsync(pendingAction.notice.id);
  };

  const handleDeleteSubmit = () => {
    if (!pendingAction || pendingAction.type !== 'delete') return;
    setActingOnId(pendingAction.notice.id);
    void deleteMutation.mutateAsync(pendingAction.notice.id);
  };

  const handleEditSave = (
    patch: Partial<Pick<PaymentNotice, 'amount' | 'narrative' | 'reference'>>,
  ) => {
    if (!pendingAction || pendingAction.type !== 'edit') return;
    setActingOnId(pendingAction.notice.id);
    void updateMutation.mutateAsync({ id: pendingAction.notice.id, patch });
  };

  return (
    <>
      <PaymentNoticesLocalFilters
        value={localFilters}
        onChange={handleLocalFiltersChange}
        onSearch={() => {
          onPaginationModelChange({ ...paginationModel, page: 0 });
          void refetch();
        }}
      />

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: 1.5,
          mb: 2,
          flexWrap: 'wrap',
        }}
      >
        <Button
          variant="contained"
          size="small"
          startIcon={<PlusIcon size={18} animateOnHover />}
          onClick={() => setAddRequestOpen(true)}
          sx={{ py: 1, px: 2, whiteSpace: 'nowrap' }}
        >
          {t('paymentNotices.actions.addRequest')}
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
          onClick={() => void refetch()}
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
        <Tab label={t('paymentNotices.subTabs.pending')} />
        <Tab label={t('paymentNotices.subTabs.allocated')} />
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
            <Skeleton key={i} variant="rounded" height={360} sx={{ borderRadius: '14px' }} />
          ))}
        </Box>
      ) : !isLoading && !hasItems ? (
        <Alert severity="info">{t('paymentNotices.empty')}</Alert>
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
            {items.map((notice) => (
              <PaymentNoticeCard
                key={notice.id}
                notice={notice}
                variant={allocationStatus}
                onConfirm={() => setPendingAction({ type: 'confirm', notice })}
                onDelete={() => setPendingAction({ type: 'delete', notice })}
                onEdit={() => setPendingAction({ type: 'edit', notice })}
                onDownload={() => setDownloadSnackbar(true)}
                onOpenLoan={() => navigate(`/prime/loans/${encodeURIComponent(notice.acquireId)}`)}
              />
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

      <AddPaymentRequestModal open={addRequestOpen} onClose={() => setAddRequestOpen(false)} />

      <ConfirmAllocateDialog
        open={pendingAction?.type === 'confirm'}
        notice={pendingAction?.type === 'confirm' ? pendingAction.notice : null}
        loading={isSubmitting && actingOnId === pendingAction?.notice.id}
        onClose={() => {
          if (!isSubmitting) setPendingAction(null);
        }}
        onConfirm={handleConfirmSubmit}
      />

      <DeleteRecordDialog
        open={pendingAction?.type === 'delete'}
        loading={isSubmitting && actingOnId === pendingAction?.notice.id}
        onClose={() => {
          if (!isSubmitting) setPendingAction(null);
        }}
        onConfirm={handleDeleteSubmit}
      />

      <EditNoticeDialog
        open={pendingAction?.type === 'edit'}
        notice={pendingAction?.type === 'edit' ? pendingAction.notice : null}
        loading={isSubmitting && actingOnId === pendingAction?.notice.id}
        onClose={() => {
          if (!isSubmitting) setPendingAction(null);
        }}
        onSave={handleEditSave}
      />

      <Snackbar
        open={downloadSnackbar}
        autoHideDuration={3000}
        onClose={() => setDownloadSnackbar(false)}
        message={t('paymentNotices.actions.downloadSuccess')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
}
