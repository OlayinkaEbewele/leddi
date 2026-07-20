import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import type { GridColDef } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { LoanDetails, ScheduleEntry } from '@/api/types';
import { ValueTag } from '@/components/ValueTag';
import { formatDisplayDate } from '@/utils/formatDate';
import { formatSignedCurrency } from '@/utils/formatSignedCurrency';
import {
  borderSubtle,
  dm,
  pageBackground,
  riskStage1,
  riskStage3,
  surface,
  surface0,
  textMuted,
} from '@/theme/theme';
import { useThemeMode } from '@/theme/ThemeModeProvider';

interface ScheduleTabProps {
  loan: LoanDetails;
  onRefresh: () => void;
}

type BalanceMode = 'arrears' | 'loan';

export function ScheduleTab({ loan, onRefresh }: ScheduleTabProps) {
  const { t } = useTranslation();
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';
  const positiveColor = isDark ? dm.success : riskStage1;
  const negativeColor = isDark ? dm.danger : riskStage3;
  const [balanceMode, setBalanceMode] = useState<BalanceMode>('arrears');
  const [filterOpen, setFilterOpen] = useState(false);

  const columns = useMemo<GridColDef<ScheduleEntry>[]>(
    () => [
      { field: 'rowNumber', headerName: '#', width: 56 },
      {
        field: 'type',
        headerName: t('loanDetails.schedule.type'),
        width: 160,
        renderCell: ({ value }) => <ValueTag value={String(value)} />,
      },
      {
        field: 'effectiveDate',
        headerName: t('loanDetails.schedule.effectiveDate'),
        width: 130,
        valueFormatter: (v) => formatDisplayDate(String(v)),
      },
      {
        field: 'postDate',
        headerName: t('loanDetails.schedule.postDate'),
        width: 130,
        valueFormatter: (v) => formatDisplayDate(String(v)),
      },
      {
        field: 'narrative',
        headerName: t('loanDetails.schedule.narrative'),
        flex: 1,
        minWidth: 220,
      },
      {
        field: 'amount',
        headerName: t('loanDetails.schedule.amount'),
        width: 130,
        renderCell: ({ value }) => {
          const num = Number(value);
          const color = num > 0 ? positiveColor : num < 0 ? negativeColor : 'inherit';
          return (
            <Typography variant="body2" sx={{ color, fontWeight: 600 }}>
              {formatSignedCurrency(num, loan.currency)}
            </Typography>
          );
        },
      },
      {
        field: balanceMode === 'arrears' ? 'arrearsBalance' : 'loanBalance',
        headerName:
          balanceMode === 'arrears'
            ? t('loanDetails.schedule.arrearsBalance')
            : t('loanDetails.schedule.loanBalance'),
        width: 140,
        valueFormatter: (v) => formatSignedCurrency(Number(v), loan.currency),
      },
    ],
    [t, loan.currency, balanceMode, positiveColor, negativeColor],
  );

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2, gap: 2 }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ flexWrap: 'wrap' }}>
          <ToggleButtonGroup
            size="small"
            exclusive
            value={balanceMode}
            onChange={(_, v: BalanceMode | null) => {
              if (v) setBalanceMode(v);
            }}
          >
            <ToggleButton value="arrears">{t('loanDetails.schedule.arrearsBalance')}</ToggleButton>
            <ToggleButton value="loan">{t('loanDetails.schedule.loanBalance')}</ToggleButton>
          </ToggleButtonGroup>
          <Button
            size="small"
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={() => {
              setFilterOpen((o) => !o);
            }}
          >
            {t('loanDetails.schedule.advancedFilter')}
          </Button>
        </Stack>
        <Button size="small" variant="outlined" startIcon={<RefreshIcon />} onClick={onRefresh}>
          {t('loanDetails.schedule.refresh')}
        </Button>
      </Stack>

      {filterOpen && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {t('loanDetails.schedule.filterPlaceholder')}
        </Typography>
      )}

      <Paper elevation={0} sx={{ height: 420, width: '100%', overflow: 'hidden' }}>
        <DataGrid
          rows={loan.scheduleEntries}
          columns={columns}
          getRowId={(row) => String(row.rowNumber)}
          disableRowSelectionOnClick
          hideFooter
          density="compact"
          sx={{
            border: 'none',
            bgcolor: surface,
            '& .MuiDataGrid-columnHeader': { bgcolor: pageBackground },
            '& .MuiDataGrid-columnHeaderTitle': {
              fontSize: '0.6875rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: textMuted,
            },
            '& .MuiDataGrid-cell': { borderColor: borderSubtle, fontSize: '0.8125rem' },
            '& .MuiDataGrid-row:nth-of-type(even)': isDark ? { bgcolor: surface0 } : undefined,
            '& .MuiDataGrid-row:hover': isDark ? { bgcolor: `${dm.surface2} !important` } : undefined,
          }}
        />
      </Paper>
    </>
  );
}
