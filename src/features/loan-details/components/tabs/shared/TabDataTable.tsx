import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import type { ReactNode } from 'react';
import { borderSubtle, textMuted } from '@/theme/theme';

export interface TabDataTableColumn {
  id: string;
  label: string;
  align?: 'left' | 'right';
  boldHeader?: boolean;
}

interface TabDataTableProps {
  columns: TabDataTableColumn[];
  children: ReactNode;
}

export function TabDataTable({ columns, children }: TabDataTableProps) {
  return (
    <TableContainer sx={{ border: `1px solid ${borderSubtle}`, borderRadius: '10px' }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: 'transparent' }}>
            {columns.map((col) => (
              <TableCell
                key={col.id}
                align={col.align ?? 'left'}
                sx={{
                  fontSize: col.boldHeader ? '0.8125rem' : '0.6875rem',
                  fontWeight: col.boldHeader ? 700 : 600,
                  letterSpacing: col.boldHeader ? 0 : '0.08em',
                  textTransform: col.boldHeader ? 'none' : 'uppercase',
                  color: col.boldHeader ? 'text.primary' : textMuted,
                  borderBottom: `1px solid ${borderSubtle}`,
                  py: 1.25,
                }}
              >
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>{children}</TableBody>
      </Table>
    </TableContainer>
  );
}
