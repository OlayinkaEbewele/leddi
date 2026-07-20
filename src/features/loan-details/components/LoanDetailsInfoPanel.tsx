import Paper from '@mui/material/Paper';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { LoanDetails } from '@/api/types';
import {
  borderSubtle,
  brandSecondary,
  cardRadius,
  cardShadow,
  dm,
  loanDetailsInfoPanelHeight,
  pageBackground,
  surface,
  textSecondary,
} from '@/theme/theme';
import { useThemeMode } from '@/theme/ThemeModeProvider';
import { AccountManagerSection } from './sections/AccountManagerSection';
import { CarDetailsSection } from './sections/CarDetailsSection';
import { CustomerDetailsSection } from './sections/CustomerDetailsSection';
import { LoanCommercialsSection } from './sections/LoanCommercialsSection';
import { LoanDetailsSection } from './sections/LoanDetailsSection';
import { RepaymentInfoSection } from './sections/RepaymentInfoSection';
import { SettlementQuoteSection } from './sections/SettlementQuoteSection';

const INFO_TAB_KEYS = [
  'customer',
  'accountManager',
  'car',
  'commercials',
  'repayment',
  'loan',
  'settlement',
] as const;

interface LoanDetailsInfoPanelProps {
  loan: LoanDetails;
}

export function LoanDetailsInfoPanel({ loan }: LoanDetailsInfoPanelProps) {
  const { t } = useTranslation();
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';
  const activeTabBg = isDark ? dm.accent : brandSecondary;
  const [tabIndex, setTabIndex] = useState(0);
  const activeKey = INFO_TAB_KEYS[tabIndex] ?? 'customer';

  return (
    <Paper
      elevation={0}
      sx={{
        height: loanDetailsInfoPanelHeight,
        display: 'flex',
        flexDirection: 'column',
        border: `1px solid ${borderSubtle}`,
        borderRadius: `${cardRadius}px`,
        boxShadow: cardShadow,
        bgcolor: surface,
        overflow: 'hidden',
      }}
    >
      <Tabs
        value={tabIndex}
        onChange={(_, v: number) => {
          setTabIndex(v);
        }}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          flexShrink: 0,
          borderBottom: `1px solid ${borderSubtle}`,
          px: 1.5,
          pt: 1,
          pb: 0.5,
          bgcolor: pageBackground,
          minHeight: 48,
          '& .MuiTab-root': {
            mx: 0.25,
            px: 2,
            py: 0.75,
            minHeight: 36,
            borderRadius: '20px',
            color: textSecondary,
            fontWeight: 600,
            fontSize: '0.8125rem',
            textTransform: 'none',
          },
          '& .MuiTab-root.Mui-selected': {
            color: isDark ? dm.textPrimary : '#FFFFFF',
            backgroundColor: activeTabBg,
          },
          '& .MuiTab-root.Mui-selected:hover': {
            color: isDark ? dm.textPrimary : '#FFFFFF',
            backgroundColor: activeTabBg,
          },
        }}
      >
        {INFO_TAB_KEYS.map((key) => (
          <Tab key={key} label={t(`loanDetails.infoTabs.${key}`)} />
        ))}
      </Tabs>

      <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto', p: 2.5 }}>
        {activeKey === 'customer' && <CustomerDetailsSection loan={loan} embedded />}
        {activeKey === 'accountManager' && <AccountManagerSection loan={loan} embedded />}
        {activeKey === 'car' && <CarDetailsSection loan={loan} embedded />}
        {activeKey === 'commercials' && <LoanCommercialsSection loan={loan} embedded />}
        {activeKey === 'repayment' && <RepaymentInfoSection loan={loan} embedded />}
        {activeKey === 'loan' && <LoanDetailsSection loan={loan} embedded />}
        {activeKey === 'settlement' && <SettlementQuoteSection loan={loan} embedded />}
      </Box>
    </Paper>
  );
}
