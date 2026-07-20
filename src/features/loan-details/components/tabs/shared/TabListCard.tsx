import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import { borderSubtle, pageBackground, surface, surface0, textPrimary, textSecondary } from '@/theme/theme';
import { useThemeMode } from '@/theme/ThemeModeProvider';

interface TabListCardProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  actionLabel: string;
  onAction?: () => void;
}

export function TabListCard({ icon, title, subtitle, actionLabel, onAction }: TabListCardProps) {
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 2,
        mb: 1.5,
        border: `1px solid ${borderSubtle}`,
        borderRadius: '10px',
        bgcolor: isDark ? surface : '#FFFFFF',
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: '8px',
          bgcolor: isDark ? surface0 : pageBackground,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          color: textSecondary,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', color: textPrimary }} noWrap>
          {title}
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: textSecondary, fontFamily: 'ui-monospace, monospace', display: 'block' }}
          noWrap
        >
          {subtitle}
        </Typography>
      </Box>
      <Button variant="outlined" size="small" onClick={onAction} sx={{ flexShrink: 0 }}>
        {actionLabel}
      </Button>
    </Box>
  );
}
