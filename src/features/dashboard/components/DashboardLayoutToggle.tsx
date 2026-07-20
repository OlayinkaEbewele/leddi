import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { borderSubtle, primaryDark, surface, textMuted } from '@/theme/theme';
import type { DashboardLayoutMode } from '../dashboardTheme';

interface DashboardLayoutToggleProps {
  value: DashboardLayoutMode;
  onChange: (mode: DashboardLayoutMode) => void;
}

export function DashboardLayoutToggle({ value, onChange }: DashboardLayoutToggleProps) {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography variant="caption" sx={{ color: textMuted, fontWeight: 500 }}>
        {t('dashboard.layout.label')}
      </Typography>
      <Box
        sx={{
          display: 'inline-flex',
          border: `1px solid ${borderSubtle}`,
          borderRadius: '8px',
          overflow: 'hidden',
          bgcolor: surface,
        }}
      >
        {(['filled', 'stripe'] as const).map((mode) => (
          <Button
            key={mode}
            size="small"
            onClick={() => onChange(mode)}
            sx={{
              minWidth: 56,
              px: 1.5,
              py: 0.5,
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 0,
              color: value === mode ? '#fff' : textMuted,
              bgcolor: value === mode ? primaryDark : 'transparent',
              '&:hover': {
                bgcolor: value === mode ? primaryDark : 'rgba(46, 49, 98, 0.04)',
              },
            }}
          >
            {t(`dashboard.layout.${mode}`)}
          </Button>
        ))}
      </Box>
    </Box>
  );
}
