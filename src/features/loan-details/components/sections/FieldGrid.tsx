import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import { textPrimary } from '@/theme/theme';

/** Minimum column width — grid recomputes columns per row from viewport width. */
export const FIELD_GRID_MIN_COLUMN_PX = 180;

export type FieldGridItem = {
  /** Stable key when label alone may duplicate. */
  id?: string;
  label: string;
  /** Plain text/number is auto-wrapped in `FieldGridText`. Pass a node for chips, currency, etc. */
  value: ReactNode;
};

interface FieldGridProps {
  fields: FieldGridItem[];
  minColumnWidth?: number;
}

/** Equal-width wrapping label+value columns for detail sections. */
export function FieldGrid({ fields, minColumnWidth = FIELD_GRID_MIN_COLUMN_PX }: FieldGridProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fill, minmax(${minColumnWidth}px, 1fr))`,
        columnGap: 3,
        rowGap: 2.5,
        alignItems: 'start',
      }}
    >
      {fields.map((field) => (
        <FieldGridCell key={field.id ?? field.label} label={field.label}>
          {renderFieldValue(field.value)}
        </FieldGridCell>
      ))}
    </Box>
  );
}

/** Single label-above-value cell — also used by Statuses section rows. */
export function FieldGridCell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        variant="body2"
        sx={{ fontWeight: 600, color: textPrimary, mb: 0.75, lineHeight: 1.3, fontSize: '0.8125rem' }}
      >
        {label}
      </Typography>
      <Box>{children}</Box>
    </Box>
  );
}

/** Default plain-text value styling inside a field cell. */
export function FieldGridText({ children }: { children: ReactNode }) {
  return (
    <Typography variant="body2" sx={{ fontWeight: 500, wordBreak: 'break-word' }}>
      {children}
    </Typography>
  );
}

/** Visually distinct block rendered below the main field grid (lists, banners, chips). */
export function FieldGridBelow({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ mt: 2.5, pt: 2.5, borderTop: 1, borderColor: 'divider' }}>{children}</Box>
  );
}

function renderFieldValue(value: ReactNode): ReactNode {
  if (value === null || value === undefined) {
    return <FieldGridText>—</FieldGridText>;
  }
  if (typeof value === 'string' || typeof value === 'number') {
    return <FieldGridText>{value}</FieldGridText>;
  }
  return value;
}
