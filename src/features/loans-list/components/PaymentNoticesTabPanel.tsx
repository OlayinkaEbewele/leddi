import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import type { GridColDef, GridPaginationModel, GridRenderCellParams } from '@mui/x-data-grid';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentNoticesApi } from '@/api';
import type { PaymentNotice, PaymentNoticesListQuery } from '@/api/types';
import { PrimeDataGrid } from '@/components/PrimeDataGrid';
import { ValueTag } from '@/components/ValueTag';
import { brandPrimary, borderSubtle, pageBackground, textSecondary } from '@/theme/theme';
import { formatCurrency, formatAmountOnly } from '@/utils/formatCurrency';
import { formatDateTime, formatIsoDate } from '@/utils/formatDate';
import { usePaymentNoticesQuery } from '../hooks/usePaymentNoticesQuery';
import {
  EMPTY_PAYMENT_NOTICES_LOCAL_FILTERS,
  type GlobalFiltersState,
  type PaymentNoticesLocalFiltersState,
} from '../types/filters';
import { AddPaymentRequestModal } from './AddPaymentRequestModal';
import {
  PaymentNoticesLocalFilters,
  PaymentNoticesTableToolbar,
} from './PaymentNoticesLocalFilters';

interface PaymentNoticesTabPanelProps {
  globalFilters: GlobalFiltersState;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
}

export function PaymentNoticesTabPanel({
  globalFilters,
  paginationModel,
  onPaginationModelChange,
}: PaymentNoticesTabPanelProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [subTab, setSubTab] = useState(0);
  const [localFilters, setLocalFilters] = useState<PaymentNoticesLocalFiltersState>(
    EMPTY_PAYMENT_NOTICES_LOCAL_FILTERS,
  );
  const [addRequestOpen, setAddRequestOpen] = useState(false);
  const [downloadSnackbar, setDownloadSnackbar] = useState(false);

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

  const invalidate = () => void queryClient.invalidateQueries({ queryKey: ['paymentNotices'] });

  const confirmMutation = useMutation({
    mutationFn: (id: string) => paymentNoticesApi.confirmPaymentNotice(id),
    onSuccess: invalidate,
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => paymentNoticesApi.deletePaymentNotice(id),
    onSuccess: invalidate,
  });
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      patch,
    }: {
      id: string;
      patch: Partial<Pick<PaymentNotice, 'amount' | 'narrative' | 'reference' | 'type'>>;
    }) => paymentNoticesApi.updatePaymentNoticeDetails(id, patch),
    onSuccess: invalidate,
  });

  const handleConfirm = useCallback(
    (id: string) => void confirmMutation.mutateAsync(id),
    [confirmMutation],
  );
  const handleDelete = useCallback(
    (id: string) => void deleteMutation.mutateAsync(id),
    [deleteMutation],
  );
  const handleUpdate = useCallback(
    (
      id: string,
      patch: Partial<Pick<PaymentNotice, 'amount' | 'narrative' | 'reference' | 'type'>>,
    ) => void updateMutation.mutateAsync({ id, patch }),
    [updateMutation],
  );

  const handleLocalFiltersChange = (next: PaymentNoticesLocalFiltersState) => {
    setLocalFilters(next);
    onPaginationModelChange({ ...paginationModel, page: 0 });
  };

  const handleSubTabChange = (index: number) => {
    setSubTab(index);
    onPaginationModelChange({ ...paginationModel, page: 0 });
  };

  const columns = useMemo<GridColDef<PaymentNotice>[]>(() => {
    const base: GridColDef<PaymentNotice>[] = [
      { field: 'id', headerName: 'ID', width: 100, flex: 0 },
      { field: 'acquireId', headerName: t('loans.columns.acquireId'), width: 130 },
      { field: 'customerName', headerName: t('loans.columns.customerName'), width: 150 },
      {
        field: 'createdAt',
        headerName: t('paymentNotices.columns.createdAt'),
        width: 150,
        renderCell: ({ value }) => (
          <Typography variant="body2" sx={{ fontSize: '0.8125rem' }}>
            {formatDateTime(String(value))}
          </Typography>
        ),
      },
      { field: 'createdBy', headerName: t('paymentNotices.columns.createdBy'), width: 120 },
      {
        field: 'country',
        headerName: t('filters.country'),
        width: 90,
        renderCell: ({ value }) => <ValueTag value={String(value)} />,
      },
      {
        field: 'product',
        headerName: t('paymentNotices.columns.product'),
        width: 120,
        renderCell: ({ value }) => <ValueTag value={String(value)} />,
      },
      {
        field: 'type',
        headerName: t('paymentNotices.columns.type'),
        width: 130,
        renderCell: ({ value }) => <ValueTag value={String(value)} />,
      },
      {
        field: 'amount',
        headerName: t('paymentNotices.columns.amount'),
        width: 130,
        renderCell: ({ row }) => (
          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8125rem' }}>
            {formatCurrency(row.amount, row.currency)}
          </Typography>
        ),
      },
      {
        field: 'paidAt',
        headerName: t('paymentNotices.columns.paidAt'),
        width: 150,
        renderCell: ({ row }) => (
          <Typography variant="body2" sx={{ fontSize: '0.8125rem' }}>
            {row.paidAt ? formatDateTime(row.paidAt) : '—'}
          </Typography>
        ),
      },
      {
        field: 'loanStatus',
        headerName: t('paymentNotices.columns.loanStatus'),
        width: 130,
        renderCell: ({ value }) => <ValueTag value={String(value)} />,
      },
      {
        field: 'narrative',
        headerName: t('paymentNotices.columns.narrative'),
        width: 200,
        flex: 1,
      },
      { field: 'reference', headerName: t('paymentNotices.columns.reference'), width: 140 },
      {
        field: 'actions',
        headerName: '',
        width: allocationStatus === 'PENDING' ? 120 : 88,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params: GridRenderCellParams<PaymentNotice>) =>
          allocationStatus === 'PENDING' ? (
            <PendingRowActions
              row={params.row}
              onConfirm={handleConfirm}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              isConfirming={confirmMutation.isPending}
              isDeleting={deleteMutation.isPending}
            />
          ) : (
            <AllocatedRowActions row={params.row} onDownload={() => setDownloadSnackbar(true)}/>
          ),
      },
    ];

    return base;
  }, [
    t,
    allocationStatus,
    handleConfirm,
    handleDelete,
    handleUpdate,
    confirmMutation.isPending,
    deleteMutation.isPending,
  ]);

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

      <Tabs
        value={subTab}
        onChange={(_, v: number) => {
          handleSubTabChange(v);
        }}
        sx={{
          mb: 2,
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
          },
          '& .MuiTab-root.Mui-selected': {
            color: '#FFFFFF',
            backgroundColor: brandPrimary,
          },
          '& .MuiTab-root.Mui-selected:hover': {
            color: '#FFFFFF',
            backgroundColor: brandPrimary,
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

      <PrimeDataGrid
        rows={data?.items ?? []}
        columns={columns}
        rowCount={data?.totalCount ?? 0}
        loading={isLoading || isFetching}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        getRowId={(row) => row.id}
        emptyMessage={t('paymentNotices.empty')}
        ariaLabel={t('loans.tabs.paymentNotices')}
        simple
        pinnedRightFields={['actions']}
        toolbar={
          <PaymentNoticesTableToolbar
            onAddRequest={() => setAddRequestOpen(true)}
            onReload={() => void refetch()}
            isReloading={isFetching}
          />
        }
      />

      <AddPaymentRequestModal open={addRequestOpen} onClose={() => setAddRequestOpen(false)} />

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

function IconAction({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Tooltip title={label} enterDelay={400}>
      <IconButton
        size="small"
        aria-label={label}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        {children}
      </IconButton>
    </Tooltip>
  );
}

function PendingRowActions({
  row,
  onConfirm,
  onDelete,
  onUpdate,
  isConfirming,
  isDeleting,
}: {
  row: PaymentNotice;
  onConfirm: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (
    id: string,
    patch: Partial<Pick<PaymentNotice, 'amount' | 'narrative' | 'reference' | 'type'>>,
  ) => void;
  isConfirming?: boolean;
  isDeleting?: boolean;
}) {
  const { t } = useTranslation();
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [amount, setAmount] = useState(String(row.amount));
  const [narrative, setNarrative] = useState(row.narrative);
  const [reference, setReference] = useState(row.reference);

  const openEdit = () => {
    setAmount(String(row.amount));
    setNarrative(row.narrative);
    setReference(row.reference);
    setEditOpen(true);
  };

  const saveEdit = () => {
    onUpdate(row.id, {
      amount: Number(amount),
      narrative,
      reference,
    });
    setEditOpen(false);
  };

  const handleConfirm = () => {
    void onConfirm(row.id);
    setConfirmOpen(false);
  };

  const handleDelete = () => {
    void onDelete(row.id);
    setDeleteOpen(false);
  };

  return (
    <>
      <Stack direction="row" spacing={0.25} alignItems="center">
        <IconAction label={t('paymentNotices.actions.confirm')} onClick={() => setConfirmOpen(true)}>
          <CheckCircleOutlineIcon fontSize="small" />
        </IconAction>
        <IconAction label={t('paymentNotices.actions.deleteRequest')} onClick={() => setDeleteOpen(true)}>
          <DeleteOutlineIcon fontSize="small" />
        </IconAction>
        <IconAction label={t('paymentNotices.actions.editRequest')} onClick={openEdit}>
          <EditOutlinedIcon fontSize="small" />
        </IconAction>
      </Stack>

      <ConfirmAllocateDialog
        open={confirmOpen}
        row={row}
        loading={isConfirming}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
      />

      <DeleteRecordDialog
        open={deleteOpen}
        loading={isDeleting}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{t('paymentNotices.actions.editRequest')}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label={t('paymentNotices.columns.amount')}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            size="small"
            type="number"
          />
          <TextField
            label={t('paymentNotices.columns.narrative')}
            value={narrative}
            onChange={(e) => setNarrative(e.target.value)}
            size="small"
            multiline
            minRows={2}
          />
          <TextField
            label={t('paymentNotices.columns.reference')}
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            size="small"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>{t('notes.add.cancel')}</Button>
          <Button variant="contained" onClick={saveEdit}>
            {t('paymentNotices.actions.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function AllocatedRowActions({
  row,
  onDownload,
}: {
  row: PaymentNotice;
  onDownload: () => void;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Stack direction="row" spacing={0.25} alignItems="center">
      <IconAction label={t('paymentNotices.actions.downloadProof')} onClick={onDownload}>
        <DownloadOutlinedIcon fontSize="small" />
      </IconAction>
      <IconAction
        label={t('paymentNotices.actions.openLoan')}
        onClick={() => navigate(`/prime/loans/${encodeURIComponent(row.acquireId)}`)}
      >
        <OpenInNewOutlinedIcon fontSize="small" />
      </IconAction>
    </Stack>
  );
}

function ConfirmAllocateDialog({
  open,
  row,
  loading,
  onClose,
  onConfirm,
}: {
  open: boolean;
  row: PaymentNotice;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('paymentNotices.confirm.title')}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
          {t('paymentNotices.confirm.heading')}
        </Typography>
        <Stack spacing={1.25}>
          <ConfirmDetailLine label={t('paymentNotices.confirm.acquireId')} value={row.acquireId} />
          <ConfirmDetailLine
            label={t('paymentNotices.confirm.amount')}
            value={formatNoticeAmount(row.amount, row.currency)}
          />
          <ConfirmDetailLine
            label={t('paymentNotices.confirm.date')}
            value={formatIsoDate(row.createdAt)}
          />
          <ConfirmDetailLine label={t('paymentNotices.confirm.reference')} value={row.reference} />
          <ConfirmDetailLine label={t('paymentNotices.confirm.narrative')} value={row.narrative} />
        </Stack>
        <Typography variant="body2" sx={{ fontWeight: 600, mt: 2.5 }}>
          {t('paymentNotices.confirm.areYouSure')}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('notes.add.cancel')}</Button>
        <Button variant="contained" onClick={onConfirm} disabled={loading}>
          {t('paymentNotices.confirm.confirmButton')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function DeleteRecordDialog({
  open,
  loading,
  onClose,
  onConfirm,
}: {
  open: boolean;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{t('paymentNotices.delete.title')}</DialogTitle>
      <DialogContent>
        <Typography variant="body2">{t('paymentNotices.delete.message')}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('notes.add.cancel')}</Button>
        <Button variant="contained" color="error" onClick={onConfirm} disabled={loading}>
          {t('paymentNotices.delete.confirmButton')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function ConfirmDetailLine({ label, value }: { label: string; value: string }) {
  return (
    <Stack direction="row" spacing={1} alignItems="flex-start">
      <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 148, flexShrink: 0 }}>
        {label}:
      </Typography>
      <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
        {value}
      </Typography>
    </Stack>
  );
}

function formatNoticeAmount(amount: number, currency: string): string {
  return `${currency} ${formatAmountOnly(amount)}`;
}
