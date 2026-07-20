import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import type { LoanDetails } from '@/api/types';
import {
  borderSubtle,
  cardRadius,
  cardShadow,
  pageBackground,
  surface,
  textPrimary,
} from '@/theme/theme';
import { LoanHistoryTimeline } from './panels/LoanHistoryTimeline';

interface LoanDetailsRightPanelProps {
  loan: LoanDetails;
}

export function LoanDetailsRightPanel({ loan }: LoanDetailsRightPanelProps) {
  const { t } = useTranslation();

  return (
    <Paper
      elevation={0}
      sx={{
        width: { lg: 260 },
        flexShrink: 0,
        bgcolor: surface,
        border: `1px solid ${borderSubtle}`,
        borderRadius: `${cardRadius}px`,
        boxShadow: cardShadow,
        overflow: 'hidden',
        position: { lg: 'sticky' },
        top: { lg: 88 },
        maxHeight: { lg: 'calc(100vh - 100px)' },
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          px: 2,
          py: 1.25,
          borderBottom: `1px solid ${borderSubtle}`,
          bgcolor: pageBackground,
          flexShrink: 0,
        }}
      >
        <Typography sx={{ fontWeight: 700, fontSize: '0.8125rem', color: textPrimary }}>
          {t('loanDetails.rightPanel.history')}
        </Typography>
      </Box>
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        <LoanHistoryTimeline entries={loan.loanHistory ?? []} />
      </Box>
    </Paper>
  );
}
