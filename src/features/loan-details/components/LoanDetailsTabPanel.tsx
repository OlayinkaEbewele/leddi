import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import {
  borderSubtle,
  brandSecondary,
  cardRadius,
  cardShadow,
  dm,
  loanDetailsTabPanelHeight,
  pageBackground,
  surface,
  textSecondary,
} from '@/theme/theme';
import { useThemeMode } from '@/theme/ThemeModeProvider';

interface LoanDetailsTabPanelProps {
  tabIndex: number;
  onTabChange: (index: number) => void;
  tabLabels: string[];
  children: React.ReactNode;
}

export function LoanDetailsTabPanel({
  tabIndex,
  onTabChange,
  tabLabels,
  children,
}: LoanDetailsTabPanelProps) {
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';
  const activeTabBg = isDark ? dm.accent : brandSecondary;

  return (
    <Paper
      elevation={0}
      sx={{
        height: loanDetailsTabPanelHeight,
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
          onTabChange(v);
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
        {tabLabels.map((label) => (
          <Tab key={label} label={label} />
        ))}
      </Tabs>
      <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto', p: 2.5 }}>{children}</Box>
    </Paper>
  );
}
