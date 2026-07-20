import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { CustomerLoanSummary } from '@/api/types';
import { ValueTag } from '@/components/ValueTag';
import { dm } from '@/theme/darkModeTokens';
import { borderSubtle, surface0, textMuted, textPrimary } from '@/theme/theme';
import { useThemeMode } from '@/theme/ThemeModeProvider';
import { formatCurrency } from '@/utils/formatCurrency';

const LOAN_CARD_HEIGHT = 72;

interface OtherLoansSectionProps {
  currentAcquireId: string;
  currentLoan: CustomerLoanSummary;
  otherLoans?: CustomerLoanSummary[];
}

export function OtherLoansSection({
  currentAcquireId,
  currentLoan,
  otherLoans = [],
}: OtherLoansSectionProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';

  const allLoans = useMemo(() => {
    const siblings = otherLoans.filter((item) => item.acquireId !== currentAcquireId);
    return [currentLoan, ...siblings];
  }, [currentLoan, currentAcquireId, otherLoans]);

  if (allLoans.length <= 1) return null;

  return (
    <Box>
      <Typography
        variant="caption"
        sx={{
          display: 'block',
          mb: 1,
          fontWeight: 700,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: textMuted,
        }}
      >
        {t('loanDetails.panels.otherLoans.title', { count: allLoans.length })}
      </Typography>
      <Stack spacing={0.75}>
        {allLoans.map((loan) => {
          const isActive = loan.acquireId === currentAcquireId;

          return (
            <Paper
              key={loan.acquireId}
              elevation={0}
              onClick={
                isActive
                  ? undefined
                  : () => navigate(`/prime/loans/${loan.acquireId}/schedule`)
              }
              sx={{
                p: 1.25,
                height: LOAN_CARD_HEIGHT,
                minHeight: LOAN_CARD_HEIGHT,
                maxHeight: LOAN_CARD_HEIGHT,
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                border: isActive
                  ? `2px solid ${isDark ? dm.accent : '#071F49'}`
                  : `1px solid ${borderSubtle}`,
                borderRadius: '8px',
                bgcolor: isActive
                  ? isDark
                    ? dm.accentMuted
                    : '#EEF2FF'
                  : isDark
                    ? surface0
                    : 'transparent',
                cursor: isActive ? 'default' : 'pointer',
                '&:hover': isActive
                  ? undefined
                  : { bgcolor: isDark ? 'rgba(255,255,255,0.04)' : 'action.hover' },
              }}
            >
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.5 }}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    color: textPrimary,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    minWidth: 0,
                    flex: 1,
                  }}
                >
                  {loan.acquireId}
                </Typography>
                {isActive && (
                  <Chip
                    label={t('loanDetails.panels.otherLoans.current')}
                    size="small"
                    sx={{
                      height: 18,
                      ml: 0.5,
                      flexShrink: 0,
                      fontSize: '0.625rem',
                      fontWeight: 700,
                      bgcolor: isDark ? dm.accent : '#071F49',
                      color: '#fff',
                    }}
                  />
                )}
              </Stack>
              <Stack
                direction="row"
                spacing={0.75}
                alignItems="center"
                useFlexGap
                sx={{ flexWrap: 'nowrap', minWidth: 0 }}
              >
                <ValueTag value={loan.operationalStatus} />
                <Typography
                  variant="caption"
                  sx={{
                    color: textMuted,
                    fontWeight: 600,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    minWidth: 0,
                    flex: 1,
                  }}
                >
                  {formatCurrency(loan.totalExposure, loan.currency)}
                </Typography>
              </Stack>
            </Paper>
          );
        })}
      </Stack>
    </Box>
  );
}
