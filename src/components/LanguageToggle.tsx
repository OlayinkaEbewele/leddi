import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { getSegmentedToggleGroupSx } from './toggleGroupStyles';

export function LanguageToggle() {
  const { i18n, t } = useTranslation();
  const muiTheme = useTheme();
  const isDark = muiTheme.palette.mode === 'dark';

  return (
    <ToggleButtonGroup
      size="small"
      exclusive
      value={i18n.language.startsWith('fr') ? 'fr' : 'en'}
      onChange={(_, value: 'en' | 'fr' | null) => {
        if (value) void i18n.changeLanguage(value);
      }}
      aria-label={t('language.toggle')}
      sx={getSegmentedToggleGroupSx(isDark)}
    >
      <ToggleButton value="en" aria-label={t('language.en')} sx={{ px: 2 }}>
        EN
      </ToggleButton>
      <ToggleButton value="fr" aria-label={t('language.fr')} sx={{ px: 2 }}>
        FR
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
