import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { useTranslation } from 'react-i18next';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { LanguageToggle } from '@/components/LanguageToggle';

export function PrimeTopBar() {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        mb: 2,
        gap: 1,
      }}
    >
      <DarkModeToggle />
      <LanguageToggle />

      <Tooltip title={t('topBar.adminConfigComingSoon')}>
        <span>
          <Button variant="outlined" startIcon={<SettingsOutlinedIcon />} disabled>
            {t('topBar.adminConfig')}
          </Button>
        </span>
      </Tooltip>
    </Box>
  );
}
