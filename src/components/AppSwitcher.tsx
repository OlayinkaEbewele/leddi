import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Popover from '@mui/material/Popover';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import {
  sidebarActiveBg,
  sidebarBorder,
  sidebarHoverBg,
  sidebarText,
  sidebarTextMuted,
} from '@/theme/theme';

interface SuiteAppItem {
  key: string;
  letter: string;
  nameKey: string;
  subtitleKey: string;
  to?: string;
  placeholder?: boolean;
}

const SUITE_APPS: SuiteAppItem[] = [
  {
    key: 'prime',
    letter: 'P',
    nameKey: 'nav.apps.prime',
    subtitleKey: 'nav.apps.primeSubtitle',
    to: '/prime',
  },
  {
    key: 'nest-m',
    letter: 'N',
    nameKey: 'nav.apps.nestM',
    subtitleKey: 'nav.apps.nestMSubtitle',
    placeholder: true,
  },
  {
    key: 'nest-v',
    letter: 'V',
    nameKey: 'nav.apps.nestV',
    subtitleKey: 'nav.apps.nestVSubtitle',
    placeholder: true,
  },
  {
    key: 'mist',
    letter: 'M',
    nameKey: 'nav.apps.mist',
    subtitleKey: 'nav.apps.mistSubtitle',
    placeholder: true,
  },
  {
    key: 'paper',
    letter: 'P',
    nameKey: 'nav.apps.paper',
    subtitleKey: 'nav.apps.paperSubtitle',
    placeholder: true,
  },
  {
    key: 'x',
    letter: 'X',
    nameKey: 'nav.apps.x',
    subtitleKey: 'nav.apps.xSubtitle',
    placeholder: true,
  },
];

function AppLetterIcon({ letter, active }: { letter: string; active: boolean }) {
  return (
    <Box
      sx={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: active ? sidebarActiveBg : 'rgba(255, 255, 255, 0.1)',
        color: active ? '#fff' : sidebarTextMuted,
        fontWeight: 700,
        fontSize: '0.8125rem',
        flexShrink: 0,
      }}
    >
      {letter}
    </Box>
  );
}

interface AppSwitcherProps {
  collapsed?: boolean;
}

export function AppSwitcher({ collapsed = false }: AppSwitcherProps) {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  return (
    <>
      <Tooltip title={t('nav.switchApp')} placement="right">
        <IconButton
          size="small"
          onClick={(e) => setAnchorEl(e.currentTarget)}
          aria-label={t('nav.switchApp')}
          sx={{
            color: sidebarTextMuted,
            border: `1px solid ${sidebarBorder}`,
            borderRadius: '8px',
            flexShrink: 0,
            '&:hover': { bgcolor: sidebarHoverBg, color: sidebarText },
          }}
        >
          <AppsOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: {
              mt: 0.75,
              minWidth: 280,
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(7, 31, 73, 0.18)',
            },
          },
        }}
      >
        <Box sx={{ px: 2, pt: 1.5, pb: 0.5 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'text.secondary' }}>
            {t('nav.section.apps')}
          </Typography>
        </Box>
        <List dense disablePadding sx={{ pb: 1 }}>
          {SUITE_APPS.map((app) => {
            const disabled = app.placeholder;
            const button = (
              <ListItemButton
                key={app.key}
                component={app.to && !disabled ? RouterLink : 'div'}
                to={app.to}
                disabled={disabled}
                onClick={() => {
                  if (!disabled) setAnchorEl(null);
                }}
                sx={{
                  mx: 1,
                  borderRadius: '10px',
                  opacity: disabled ? 0.5 : 1,
                  '&:hover': disabled ? {} : { bgcolor: 'action.hover' },
                }}
              >
                <ListItemIcon sx={{ minWidth: 44 }}>
                  <AppLetterIcon letter={app.letter} active={app.key === 'prime'} />
                </ListItemIcon>
                <ListItemText
                  primary={t(app.nameKey)}
                  secondary={disabled ? t('nav.apps.comingSoon') : t(app.subtitleKey)}
                  slotProps={{
                    primary: { sx: { fontWeight: 600, fontSize: '0.875rem' } },
                    secondary: { sx: { fontSize: '0.6875rem' } },
                  }}
                />
              </ListItemButton>
            );

            return collapsed && disabled ? (
              <Tooltip key={app.key} title={t('nav.apps.comingSoon')} placement="right">
                <span>{button}</span>
              </Tooltip>
            ) : (
              button
            );
          })}
        </List>
      </Popover>
    </>
  );
}
