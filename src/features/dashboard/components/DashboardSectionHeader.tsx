import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import { textMuted } from '@/theme/theme';

interface DashboardSectionHeaderProps {
  overline: string;
  title: string;
  action?: ReactNode;
}

export function DashboardSectionHeader({ overline, title, action }: DashboardSectionHeaderProps) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography
        variant="microLabel"
        sx={{ color: textMuted, display: 'block', mb: 0.5, letterSpacing: '0.08em' }}
      >
        {overline}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.125rem' }}>
          {title}
        </Typography>
        {action}
      </Box>
    </Box>
  );
}
