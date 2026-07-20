import Box from '@mui/material/Box';
import type { ReactNode } from 'react';
import { borderSubtle } from '@/theme/theme';

/** Shared multi-row grid for Statuses — columns align across both rows. */
export const STATUSES_GRID_COLUMNS =
  'minmax(0, 1.35fr) minmax(0, 1fr) minmax(0, 0.85fr) minmax(0, 1fr) auto';

export function StatusesGrid({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: STATUSES_GRID_COLUMNS,
        columnGap: 3,
        rowGap: 2,
        alignItems: 'start',
      }}
    >
      {children}
    </Box>
  );
}

export function StatusesDivider() {
  return (
    <Box
      sx={{
        gridColumn: '1 / -1',
        borderBottom: 1,
        borderColor: borderSubtle,
        my: 0.5,
      }}
    />
  );
}

export { FieldGridCell } from './FieldGrid';
