import Typography from '@mui/material/Typography';
import { dm } from '@/theme/darkModeTokens';
import { accent, chipTones } from '@/theme/theme';
import { useThemeMode } from '@/theme/ThemeModeProvider';

interface IfrsStatusBadgeProps {
  value: number | null;
  /** Table view uses accent styling for truthy values; detail page stays neutral for 0. */
  variant?: 'table' | 'detail';
}

/**
 * Shared IFRS status badge — patch v0.3 §1.
 * null → dash; 0 → neutral gray pill; truthy → accent pill in table, neutral in detail.
 */
export function IfrsStatusBadge({ value, variant = 'detail' }: IfrsStatusBadgeProps) {
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';

  if (value === null) {
    return (
      <Typography variant="body2" color="text.secondary">
        —
      </Typography>
    );
  }

  const isAccent = variant === 'table' && value > 0;
  const neutral = chipTones.neutral;

  if (isDark && isAccent) {
    return (
      <Typography
        component="span"
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 28,
          height: 22,
          px: 0.75,
          borderRadius: '6px',
          bgcolor: dm.ifrsBg,
          color: dm.ifrsText,
          border: `1px solid ${dm.warningBorder}`,
          fontSize: '0.6875rem',
          fontWeight: 700,
        }}
      >
        {`${value}+`}
      </Typography>
    );
  }

  return (
    <Typography
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 28,
        height: 22,
        px: 0.75,
        borderRadius: '6px',
        bgcolor: isAccent ? `${accent}22` : neutral.bg,
        color: isAccent ? accent : neutral.color,
        border: `1px solid ${isAccent ? accent : neutral.border}`,
        fontSize: '0.6875rem',
        fontWeight: 700,
      }}
    >
      {variant === 'table' && value > 0 ? `${value}+` : value}
    </Typography>
  );
}
