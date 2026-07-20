import Chip from '@mui/material/Chip';
import { useThemeMode } from '@/theme/ThemeModeProvider';
import { getTagColor } from '@/utils/tagColor';

interface ValueTagProps {
  value: string;
  ariaLabel?: string;
}

/** Deterministic-color tag for table columns and role chips. */
export function ValueTag({ value, ariaLabel }: ValueTagProps) {
  const { mode } = useThemeMode();
  const colors = getTagColor(value, mode);

  return (
    <Chip
      label={value}
      size="small"
      aria-label={ariaLabel ?? value}
      sx={{
        bgcolor: colors.bg,
        color: colors.color,
        border: `1px solid ${colors.border}`,
        fontWeight: 600,
        maxWidth: '100%',
      }}
    />
  );
}
