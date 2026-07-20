import type { SxProps, Theme } from '@mui/material/styles';
import { tokenVars } from '@/theme/cssVars';

/** Shared segmented control look for theme + language toggles. */
export function getSegmentedToggleGroupSx(isDark: boolean): SxProps<Theme> {
  return {
    bgcolor: isDark ? tokenVars.surface : tokenVars.surface,
    borderRadius: '8px',
    '& .MuiToggleButtonGroup-grouped': {
      border: `1px solid ${tokenVars.borderSubtle}`,
      borderRadius: '8px !important',
      mx: 0.25,
      px: 1.25,
      py: 0.5,
      fontSize: '0.8125rem',
      fontWeight: 600,
      color: tokenVars.textSecondary,
      minWidth: 36,
      '&.Mui-selected': {
        bgcolor: tokenVars.accent,
        color: isDark ? tokenVars.textPrimary : '#fff',
        borderColor: tokenVars.accent,
        '&:hover': { bgcolor: tokenVars.accentHover },
      },
      '&:hover': {
        bgcolor: tokenVars.surface2,
      },
    },
  };
}
