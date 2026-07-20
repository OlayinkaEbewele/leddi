import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import SwapHorizOutlinedIcon from '@mui/icons-material/SwapHorizOutlined';
import UpdateOutlinedIcon from '@mui/icons-material/UpdateOutlined';
import ViewListOutlinedIcon from '@mui/icons-material/ViewListOutlined';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useTranslation } from 'react-i18next';
import { dm } from '@/theme/darkModeTokens';
import { useThemeMode } from '@/theme/ThemeModeProvider';
import {
  actionPrimary,
  borderSubtle,
  pageBackground,
  textMuted,
  textSecondary,
} from '@/theme/theme';

export const PRIME_TAB_KEYS = [
  'loans',
  'paymentNotices',
  'ptp',
  'restructure',
  'statusUpdates',
  'settledDeals',
  'dealAdminRequests',
] as const;

export type PrimeTabKey = (typeof PRIME_TAB_KEYS)[number];

const TAB_ICONS: Record<PrimeTabKey, React.ReactElement> = {
  loans: <ViewListOutlinedIcon fontSize="small" />,
  paymentNotices: <PaymentOutlinedIcon fontSize="small" />,
  ptp: <EventNoteOutlinedIcon fontSize="small" />,
  restructure: <SwapHorizOutlinedIcon fontSize="small" />,
  statusUpdates: <UpdateOutlinedIcon fontSize="small" />,
  settledDeals: <CheckCircleOutlinedIcon fontSize="small" />,
  dealAdminRequests: <AssignmentOutlinedIcon fontSize="small" />,
};

interface PrimeTabStripProps {
  value: number;
  onChange: (index: number) => void;
  tabCounts?: Partial<Record<PrimeTabKey, number>>;
}

export function PrimeTabStrip({ value, onChange, tabCounts }: PrimeTabStripProps) {
  const { t } = useTranslation();
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';
  const activeTabBg = isDark ? dm.accent : actionPrimary;
  const activeTabColor = isDark ? dm.textPrimary : '#FFFFFF';
  const countBgInactive = isDark ? dm.surface2 : '#EEF1F4';

  return (
    <Tabs
      value={value}
      onChange={(_, v: number) => {
        onChange(v);
      }}
      variant="scrollable"
      scrollButtons="auto"
      sx={{
        mb: 2,
        minHeight: 48,
        borderBottom: `1px solid ${borderSubtle}`,
        px: 1.5,
        pt: 1,
        pb: 0.5,
        bgcolor: pageBackground,
        '& .MuiTab-root': {
          mx: 0.25,
          px: 2,
          py: 0.75,
          minHeight: 36,
          borderRadius: '20px',
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.8125rem',
          gap: 0.75,
          color: textSecondary,
          bgcolor: 'transparent',
        },
        '& .MuiTab-root.Mui-selected': {
          color: `${activeTabColor} !important`,
          bgcolor: `${activeTabBg} !important`,
        },
        '& .MuiTab-root.Mui-selected:hover': {
          color: `${activeTabColor} !important`,
          bgcolor: `${activeTabBg} !important`,
        },
        '& .MuiTab-root.Mui-selected .MuiTab-iconWrapper': {
          color: 'inherit',
        },
        '& .MuiTabs-indicator': {
          display: 'none',
        },
      }}
    >
      {PRIME_TAB_KEYS.map((key, index) => {
        const count = tabCounts?.[key];
        const isSelected = value === index;
        const label = (
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
            {t(`loans.tabs.${key}`)}
            {count !== undefined && (
              <Box
                component="span"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: 22,
                  height: 22,
                  px: 0.5,
                  borderRadius: '20px',
                  bgcolor: isSelected ? 'rgba(255, 255, 255, 0.22)' : countBgInactive,
                  color: isSelected ? activeTabColor : textMuted,
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                }}
              >
                {count > 999 ? '999+' : count}
              </Box>
            )}
          </Box>
        );

        return (
          <Tab
            key={key}
            icon={TAB_ICONS[key]}
            iconPosition="start"
            label={label}
            sx={{ '& .MuiTab-iconWrapper': { mb: '0 !important' } }}
          />
        );
      })}
    </Tabs>
  );
}
