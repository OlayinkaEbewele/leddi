import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import SwapHorizOutlinedIcon from '@mui/icons-material/SwapHorizOutlined';
import UpdateOutlinedIcon from '@mui/icons-material/UpdateOutlined';
import ViewListOutlinedIcon from '@mui/icons-material/ViewListOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { AppSwitcher } from '@/components/AppSwitcher';
import { EnvironmentPill } from '@/components/EnvironmentPill';
import { RoleChip } from '@/components/RoleChip';
import { useAuth, useCurrentUser } from '@/auth/UserContext';
import { dm } from '@/theme/darkModeTokens';
import {
  accent,
  brandYellow,
  sidebarActiveBg,
  sidebarBg,
  sidebarBorder,
  sidebarHoverBg,
  sidebarText,
  sidebarTextMuted,
  sidebarWidthCollapsed,
  sidebarWidthExpanded,
} from '@/theme/theme';
import { useThemeMode } from '@/theme/ThemeModeProvider';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

interface NavItem {
  key: string;
  to: string;
  labelKey: string;
  icon: React.ReactElement;
  match: (pathname: string, search: string) => boolean;
}

const PRIME_NAV_ITEMS: NavItem[] = [
  {
    key: 'dashboard',
    to: '/prime',
    labelKey: 'nav.dashboard',
    icon: <DashboardOutlinedIcon fontSize="small" />,
    match: (pathname) => pathname === '/prime',
  },
  {
    key: 'loans',
    to: '/prime/loans',
    labelKey: 'loans.tabs.loans',
    icon: <ViewListOutlinedIcon fontSize="small" />,
    match: (pathname, search) =>
      pathname.startsWith('/prime/loans') &&
      (!search.includes('activeTab=') || search.includes('activeTab=loans')),
  },
  {
    key: 'paymentNotices',
    to: '/prime/loans?activeTab=paymentNotices',
    labelKey: 'loans.tabs.paymentNotices',
    icon: <PaymentOutlinedIcon fontSize="small" />,
    match: (_, search) => search.includes('activeTab=paymentNotices'),
  },
  {
    key: 'ptp',
    to: '/prime/loans?activeTab=ptp',
    labelKey: 'loans.tabs.ptp',
    icon: <EventNoteOutlinedIcon fontSize="small" />,
    match: (_, search) => search.includes('activeTab=ptp'),
  },
  {
    key: 'restructure',
    to: '/prime/loans?activeTab=restructure',
    labelKey: 'loans.tabs.restructure',
    icon: <SwapHorizOutlinedIcon fontSize="small" />,
    match: (_, search) => search.includes('activeTab=restructure'),
  },
  {
    key: 'statusUpdates',
    to: '/prime/loans?activeTab=statusUpdates',
    labelKey: 'loans.tabs.statusUpdates',
    icon: <UpdateOutlinedIcon fontSize="small" />,
    match: (_, search) => search.includes('activeTab=statusUpdates'),
  },
  {
    key: 'settledDeals',
    to: '/prime/loans?activeTab=settledDeals',
    labelKey: 'loans.tabs.settledDeals',
    icon: <CheckCircleOutlinedIcon fontSize="small" />,
    match: (_, search) => search.includes('activeTab=settledDeals'),
  },
  {
    key: 'dealAdminRequests',
    to: '/prime/loans?activeTab=dealAdminRequests',
    labelKey: 'loans.tabs.dealAdminRequests',
    icon: <AssignmentOutlinedIcon fontSize="small" />,
    match: (_, search) => search.includes('activeTab=dealAdminRequests'),
  },
];

export function Sidebar({ collapsed, onToggleCollapsed }: SidebarProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const user = useCurrentUser();
  const { logout } = useAuth();
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';
  const width = collapsed ? sidebarWidthCollapsed : sidebarWidthExpanded;

  const navBg = isDark ? dm.surface1 : sidebarBg;
  const navBorder = isDark ? dm.border : sidebarBorder;
  const navText = isDark ? dm.textPrimary : sidebarText;
  const navTextMuted = isDark ? dm.textSecondary : sidebarTextMuted;
  const navSectionLabel = isDark ? dm.textMuted : sidebarTextMuted;
  const navActiveBg = isDark ? dm.sidebarActiveBg : sidebarActiveBg;
  const navHoverBg = isDark ? dm.surface2 : sidebarHoverBg;

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <Box
      component="nav"
      aria-label={t('nav.sidebar')}
      sx={{
        position: 'sticky',
        top: 0,
        width,
        height: '100vh',
        flexShrink: 0,
        bgcolor: navBg,
        borderRight: `1px solid ${navBorder}`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'width 0.2s ease',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          px: collapsed ? 1 : 2,
          pt: 2,
          pb: collapsed ? 1.5 : 1.5,
          flexShrink: 0,
        }}
      >
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AppSwitcher collapsed={collapsed} />
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: brandYellow,
                borderRadius: collapsed ? '8px' : '10px',
                p: collapsed ? 0.5 : 0.75,
                flexShrink: 0,
              }}
            >
              <Box
                component="img"
                src="/leddi-logo.png"
                alt="Leddi"
                sx={{
                  height: collapsed ? 20 : 24,
                  width: 'auto',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </Box>
            {!collapsed && (
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: '0.6875rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: isDark ? dm.textPrimary : '#fff',
                  lineHeight: 1.2,
                }}
              >
                {t('app.title')}
              </Typography>
            )}
          </Box>
          {!collapsed && (
            <Box sx={{ mt: 1.25 }}>
              <EnvironmentPill variant="sidebar" />
            </Box>
          )}
        </Box>
        <Tooltip title={collapsed ? t('nav.expand') : t('nav.collapse')}>
          <IconButton
            size="small"
            onClick={onToggleCollapsed}
            aria-label={collapsed ? t('nav.expand') : t('nav.collapse')}
            sx={{ color: navTextMuted, mt: -0.25 }}
          >
            {collapsed ? (
              <ChevronRightIcon fontSize="small" />
            ) : (
              <ChevronLeftIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', py: 1 }}>
        {!collapsed && (
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              px: 2.5,
              pb: 0.75,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: navSectionLabel,
              fontSize: '0.625rem',
            }}
          >
            {t('nav.section.workflows')}
          </Typography>
        )}
        <List
          dense
          disablePadding
          sx={
            collapsed
              ? { display: 'flex', flexDirection: 'column', gap: 0.5, px: 0.75 }
              : { px: 1 }
          }
        >
          {PRIME_NAV_ITEMS.map((item) => {
            const active = item.match(location.pathname, location.search);
            const button = (
              <ListItemButton
                key={item.key}
                component={RouterLink}
                to={item.to}
                selected={active}
                sx={{
                  mb: 0.25,
                  borderRadius: '10px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  px: collapsed ? 1 : 1.5,
                  py: collapsed ? 1.25 : 0.875,
                  minHeight: collapsed ? 44 : undefined,
                  color: navText,
                  borderLeft: active && isDark ? `3px solid ${dm.sidebarActiveBorder}` : '3px solid transparent',
                  '&.Mui-selected': {
                    bgcolor: navActiveBg,
                    color: navText,
                  },
                  '&:hover': { bgcolor: navHoverBg },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: collapsed ? 0 : 36,
                    justifyContent: 'center',
                    color: active ? navText : navTextMuted,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText
                    primary={t(item.labelKey)}
                    slotProps={{
                      primary: {
                        sx: { fontSize: '0.8125rem', fontWeight: active ? 700 : 600, color: active ? navText : navTextMuted },
                      },
                    }}
                  />
                )}
              </ListItemButton>
            );

            return collapsed ? (
              <Tooltip key={item.key} title={t(item.labelKey)} placement="right">
                <span style={{ display: 'block' }}>{button}</span>
              </Tooltip>
            ) : (
              button
            );
          })}
        </List>
      </Box>

      <Box
        sx={{
          p: collapsed ? 1 : 1.5,
          flexShrink: 0,
          borderTop: `1px solid ${navBorder}`,
        }}
      >
        <Tooltip
          title={collapsed ? `${user.name} · ${user.roles.join(', ')}` : ''}
          placement="right"
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: collapsed ? 'center' : 'flex-start',
              justifyContent: collapsed ? 'center' : 'flex-start',
              gap: 1,
              mb: collapsed ? 0 : 1.5,
            }}
          >
            <Avatar
              sx={{
                width: collapsed ? 32 : 36,
                height: collapsed ? 32 : 36,
                bgcolor: 'rgba(255, 255, 255, 0.12)',
                color: accent,
                fontSize: '0.75rem',
                fontWeight: 700,
                flexShrink: 0,
                border: `1px solid ${navBorder}`,
              }}
            >
              {initials}
            </Avatar>
            {!collapsed && (
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: navText }} noWrap>
                  {user.name}
                </Typography>
                <Typography variant="caption" noWrap sx={{ display: 'block', color: isDark ? dm.textMuted : sidebarTextMuted }}>
                  {user.email}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.75 }}>
                  {user.roles.map((role) => (
                    <RoleChip key={role} role={role} />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </Tooltip>

        {!collapsed && (
          <Button
            fullWidth
            variant="outlined"
            startIcon={<LogoutOutlinedIcon fontSize="small" />}
            onClick={logout}
            sx={{
              borderColor: navBorder,
              color: navText,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.8125rem',
              py: 0.75,
              '&:hover': {
                borderColor: isDark ? dm.textSecondary : 'rgba(255, 255, 255, 0.25)',
                bgcolor: navHoverBg,
              },
            }}
          >
            {t('nav.logout')}
          </Button>
        )}
      </Box>
    </Box>
  );
}
