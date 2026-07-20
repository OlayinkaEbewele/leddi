import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Snackbar from '@mui/material/Snackbar';
import type { GridPaginationModel } from '@mui/x-data-grid';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { LoanListItem } from '@/api/types';
import { LoanListCard } from './LoanListCard';
import { LoansListPagination } from './LoansListPagination';

interface LoansTabPanelProps {
  rows: LoanListItem[];
  rowCount: number;
  loading: boolean;
  isError: boolean;
  isReloading?: boolean;
  onRetry: () => void;
  onReload: () => void;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
}

export function LoansTabPanel({
  rows,
  rowCount,
  loading,
  isError,
  onRetry,
  paginationModel,
  onPaginationModelChange,
}: LoansTabPanelProps) {
  const { t } = useTranslation();
  const [copySnackbarOpen, setCopySnackbarOpen] = useState(false);

  if (isError) {
    return (
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={onRetry}>
            {t('loans.retry')}
          </Button>
        }
      >
        {t('loans.error')}
      </Alert>
    );
  }

  if (loading && rows.length === 0) {
    return (
      <Box>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} variant="rounded" height={108} sx={{ mb: 1.5, borderRadius: '10px' }} />
        ))}
      </Box>
    );
  }

  if (!loading && rows.length === 0) {
    return <Alert severity="info">{t('loans.empty')}</Alert>;
  }

  return (
    <>
      <Box>
        {rows.map((loan) => (
          <LoanListCard
            key={loan.acquireId}
            loan={loan}
            onCopyId={() => {
              setCopySnackbarOpen(true);
            }}
          />
        ))}
      </Box>

      <LoansListPagination
        page={paginationModel.page}
        pageSize={paginationModel.pageSize}
        totalCount={rowCount}
        onPageChange={(page) => {
          onPaginationModelChange({ ...paginationModel, page });
        }}
      />

      <Snackbar
        open={copySnackbarOpen}
        autoHideDuration={2000}
        onClose={() => {
          setCopySnackbarOpen(false);
        }}
        message={t('copy.copied')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
}
