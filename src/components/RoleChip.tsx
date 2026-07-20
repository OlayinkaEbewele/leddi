import Chip from '@mui/material/Chip';
import type { Role } from '@/auth/roles';
import { formatRoleLabel } from '@/auth/roles';
import { useThemeMode } from '@/theme/ThemeModeProvider';
import { getTagColor } from '@/utils/tagColor';

interface RoleChipProps {
  role: Role;
}

export function RoleChip({ role }: RoleChipProps) {
  const { mode } = useThemeMode();
  const label = formatRoleLabel(role);
  const colors = getTagColor(role, mode);

  return (
    <Chip
      label={label}
      size="small"
      sx={{
        bgcolor: colors.bg,
        color: colors.color,
        border: `1px solid ${colors.border}`,
        fontWeight: 600,
        fontSize: '0.625rem',
        height: 20,
      }}
    />
  );
}
