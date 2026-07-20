import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useTranslation } from 'react-i18next';
import { useThemeMode } from '@/theme/ThemeModeProvider';
import type { ColorMode } from '@/theme/tokens';
import { getSegmentedToggleGroupSx } from './toggleGroupStyles';

interface DarkModeToggleProps {
  /** When true, hides the control (e.g. login is always light). */
  hidden?: boolean;
}

export function DarkModeToggle({ hidden = false }: DarkModeToggleProps) {
  const { t } = useTranslation();
  const { mode, isDark, setMode } = useThemeMode();

  if (hidden) return null;

  return (
    <ToggleButtonGroup
      size="small"
      exclusive
      value={mode}
      onChange={(_, value: ColorMode | null) => {
        if (value) setMode(value);
      }}
      aria-label={t('nav.darkMode')}
      sx={getSegmentedToggleGroupSx(isDark)}
    >
      <ToggleButton value="light" aria-label={t('nav.lightMode')}>
        <LightModeOutlinedIcon fontSize="small" />
      </ToggleButton>
      <ToggleButton value="dark" aria-label={t('nav.darkMode')}>
        <DarkModeOutlinedIcon fontSize="small" />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
