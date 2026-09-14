import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  DataGrid,
  type GridCellParams,
  type GridColDef,
  type GridPaginationModel,
  type GridRowParams,
} from '@mui/x-data-grid';
import type { ReactNode } from 'react';
import { dm } from '@/theme/darkModeTokens';
import { borderSubtle, pageBackground, surface, surface0, textMuted } from '@/theme/theme';
import { useThemeMode } from '@/theme/ThemeModeProvider';

interface PrimeDataGridProps<T extends object> {
  rows: T[];
  columns: GridColDef<T>[];
  rowCount: number;
  loading: boolean;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  getRowId: (row: T) => string;
  onRowClick?: (row: T) => void;
  onCellClick?: (params: GridCellParams<T>) => void;
  onReload?: () => void;
  isReloading?: boolean;
  reloadLabel?: string;
  toolbar?: ReactNode;
  emptyMessage?: string;
  ariaLabel: string;
  height?: string;
  pageSizeOptions?: number[];
  /** Hides column menu, filter, and selector controls for a simpler table. */
  simple?: boolean;
  /** Keeps listed columns sticky on the right while horizontally scrolling. */
  pinnedRightFields?: string[];
}

export function PrimeDataGrid<T extends object>({
  rows,
  columns,
  rowCount,
  loading,
  paginationModel,
  onPaginationModelChange,
  getRowId,
  onRowClick,
  onCellClick,
  onReload,
  isReloading,
  reloadLabel = 'Reload',
  toolbar,
  emptyMessage = 'No rows match your filters.',
  ariaLabel,
  height = 'calc(100vh - 420px)',
  pageSizeOptions = [10, 25, 50],
  simple = false,
  pinnedRightFields = [],
}: PrimeDataGridProps<T>) {
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';

  if (loading && rows.length === 0) {
    return (
      <Box>
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} height={36} sx={{ mb: 0.5 }} />
        ))}
      </Box>
    );
  }

  if (!loading && rows.length === 0) {
    return <Alert severity="info">{emptyMessage}</Alert>;
  }

  const showToolbar = Boolean(onReload || toolbar);
  const pinnedSx = buildPinnedRightSx(pinnedRightFields, isDark);
  const rowHoverBg = isDark ? dm.surface2 : 'rgba(46, 49, 98, 0.02)';

  return (
    <Paper
      elevation={0}
      sx={{ height, width: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
    >
      {showToolbar && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 1,
            width: '100%',
            px: 1.5,
            py: 1,
            borderBottom: `1px solid ${borderSubtle}`,
            bgcolor: surface,
          }}
        >
          {toolbar}
          {onReload && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={onReload}
              disabled={isReloading}
            >
              {reloadLabel}
            </Button>
          )}
        </Box>
      )}
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={getRowId}
          rowCount={rowCount}
          loading={loading}
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={onPaginationModelChange}
          pageSizeOptions={pageSizeOptions}
          disableRowSelectionOnClick
          disableColumnMenu={simple}
          disableColumnFilter={simple}
          disableColumnSelector={simple}
          onRowClick={
            onRowClick
              ? (params: GridRowParams<T>) => {
                  onRowClick(params.row);
                }
              : undefined
          }
          onCellClick={onCellClick}
          sx={{
            border: 'none',
            height: '100%',
            bgcolor: surface,
            '& .MuiDataGrid-columnHeader': { bgcolor: pageBackground },
            '& .MuiDataGrid-columnHeaderTitle': {
              fontSize: '0.6875rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: textMuted,
            },
            '& .MuiDataGrid-cell': {
              borderColor: borderSubtle,
              fontSize: '0.8125rem',
              display: 'flex',
              alignItems: 'center',
              ...(onCellClick ? { cursor: 'copy' } : {}),
            },
            '& .MuiDataGrid-cell[data-field="actions"]': {
              cursor: 'default',
            },
            '& .MuiDataGrid-row': onRowClick
              ? { cursor: 'pointer', '&:hover': { bgcolor: rowHoverBg } }
              : isDark
                ? { '&:hover': { bgcolor: rowHoverBg } }
                : undefined,
            '& .MuiDataGrid-row:nth-of-type(even)': isDark
              ? { bgcolor: surface0 }
              : undefined,
            '& .MuiTablePagination-root': isDark
              ? { color: dm.textSecondary, '& .Mui-selected': { color: dm.accent } }
              : undefined,
            ...pinnedSx,
          }}
          density="standard"
          rowHeight={48}
          columnHeaderHeight={44}
          aria-label={ariaLabel}
        />
      </Box>
    </Paper>
  );
}

function buildPinnedRightSx(fields: string[], isDark: boolean): Record<string, object> {
  if (fields.length === 0) return {};

  /** Opaque row hover — must not use rgba or scrolled cells bleed through sticky column. */
  const rowHoverBg = isDark ? dm.surface2 : '#F4F6F8';

  const pinnedCellSelectors = fields.map((field) => `& .MuiDataGrid-cell[data-field="${field}"]`);
  const pinnedHeaderSelectors = fields.map(
    (field) => `& .MuiDataGrid-columnHeader[data-field="${field}"]`,
  );
  const pinnedCellHoverSelectors = fields.map(
    (field) => `& .MuiDataGrid-row:hover .MuiDataGrid-cell[data-field="${field}"]`,
  );

  return {
    [pinnedCellSelectors.join(', ')]: {
      position: 'sticky',
      right: 0,
      zIndex: 2,
      borderLeft: `1px solid ${borderSubtle}`,
      boxShadow: isDark ? 'none' : '-4px 0 8px rgba(46, 49, 98, 0.06)',
      bgcolor: `${surface} !important`,
    },
    [pinnedHeaderSelectors.join(', ')]: {
      position: 'sticky',
      right: 0,
      zIndex: 3,
      borderLeft: `1px solid ${borderSubtle}`,
      boxShadow: isDark ? 'none' : '-4px 0 8px rgba(46, 49, 98, 0.06)',
      bgcolor: `${pageBackground} !important`,
    },
    [pinnedCellHoverSelectors.join(', ')]: {
      bgcolor: `${rowHoverBg} !important`,
    },
  };
}
