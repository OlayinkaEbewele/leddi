import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import type { LoanDetails } from '@/api/types';
import { PaymentHistoryMonthTags } from '@/components/PaymentHistoryMonthTags';
import { ValueTag } from '@/components/ValueTag';
import { showNplBadge } from '@/features/loans-list/utils/loanListCardUtils';
import { OtherLoansSection } from './panels/OtherLoansSection';
import { dm } from '@/theme/darkModeTokens';
import {
  borderSubtle,
  cardRadius,
  cardShadow,
  dashboardGreen,
  riskStage1,
  riskStage3,
  surface,
  surface0,
  textMuted,
  textPrimary,
  textSecondary,
} from '@/theme/theme';
import { useThemeMode } from '@/theme/ThemeModeProvider';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDisplayDate } from '@/utils/formatDate';

interface LoanDetailsSidebarProps {
  loan: LoanDetails;
}

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function ptpRateColor(rate: number, isDark: boolean): string {
  if (rate >= 80) return isDark ? dm.success : riskStage1;
  if (rate >= 50) return isDark ? dm.success : dashboardGreen;
  return isDark ? dm.danger : riskStage3;
}

export function LoanDetailsSidebar({ loan }: LoanDetailsSidebarProps) {
  const { t } = useTranslation();
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';
  const hasArrears = Math.abs(loan.arrearsBalance) > 0;

  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: surface,
        border: `1px solid ${borderSubtle}`,
        borderRadius: `${cardRadius}px`,
        boxShadow: cardShadow,
        overflow: 'hidden',
        position: { lg: 'sticky' },
        top: { lg: 88 },
        width: { lg: 280 },
        flexShrink: 0,
      }}
    >
      <Box sx={{ p: 2.5 }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              bgcolor: isDark ? dm.accent : dashboardGreen,
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.9375rem',
            }}
          >
            {initialsFromName(loan.customer.fullName)}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', color: textPrimary }} noWrap>
              {loan.customer.fullName}
            </Typography>
            <Typography variant="caption" sx={{ color: textSecondary }} noWrap>
              {loan.acquireId}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={0.75} sx={{ flexWrap: 'wrap', mb: 2 }} useFlexGap>
          {showNplBadge(loan) && (
            <Box
              sx={{
                px: 0.75,
                py: 0.25,
                borderRadius: '6px',
                bgcolor: isDark ? dm.dangerBg : '#FCEAEA',
                color: isDark ? dm.danger : riskStage3,
                fontSize: '0.6875rem',
                fontWeight: 700,
              }}
            >
              NPL
            </Box>
          )}
          <ValueTag value={loan.operationalStatus.status} />
          <ValueTag value={loan.loanCategory} />
        </Stack>

        {loan.paymentHistory.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <PaymentHistoryMonthTags months={loan.paymentHistory} />
          </Box>
        )}

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            mb: loan.otherLoans.length > 0 ? 2.5 : 0,
          }}
        >
          <SidebarMetric
            label={t('loanDetails.statuses.arrearsBalance')}
            value={
              hasArrears ? formatCurrency(Math.abs(loan.arrearsBalance), loan.currency) : '—'
            }
            valueColor={hasArrears ? (isDark ? dm.danger : riskStage3) : textMuted}
            isDark={isDark}
          />
          <SidebarMetric
            label={t('loans.columns.totalExposure')}
            value={formatCurrency(loan.totalExposure, loan.currency)}
            isDark={isDark}
          />
          <SidebarMetric
            label={t('loanDetails.statuses.totalPaid')}
            value={formatCurrency(loan.totalPaid, loan.currency)}
            isDark={isDark}
          />
          <SidebarMetric
            label={t('loanDetails.loan.ptpRate')}
            value={`${loan.ptpRate}%`}
            valueColor={ptpRateColor(loan.ptpRate, isDark)}
            isDark={isDark}
          />
          <SidebarMetric
            label={t('loanDetails.statuses.lastPayment')}
            value={formatCurrency(loan.lastPaymentAmount, loan.currency)}
            subValue={formatDisplayDate(loan.lastPaymentDate)}
            isDark={isDark}
          />
        </Box>

        <OtherLoansSection
          currentAcquireId={loan.acquireId}
          currentLoan={{
            acquireId: loan.acquireId,
            operationalStatus: loan.operationalStatus.status,
            totalExposure: loan.totalExposure,
            currency: loan.currency,
          }}
          otherLoans={loan.otherLoans}
        />
      </Box>
    </Paper>
  );
}

function SidebarMetric({
  label,
  value,
  subValue,
  valueColor = textPrimary,
  isDark = false,
}: {
  label: string;
  value: string;
  subValue?: string;
  valueColor?: string;
  isDark?: boolean;
}) {
  return (
    <Box
      sx={{
        bgcolor: isDark ? surface0 : '#F8F9FB',
        border: `1px solid ${isDark ? dm.border : borderSubtle}`,
        borderRadius: '8px',
        p: 1.25,
        minWidth: 0,
      }}
    >
      <Typography
        variant="microLabel"
        sx={{ display: 'block', mb: 0.5, color: textMuted, fontSize: '0.625rem' }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: '0.875rem',
          color: valueColor,
          lineHeight: 1.3,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {value}
      </Typography>
      {subValue && (
        <Typography variant="caption" sx={{ color: textSecondary, display: 'block', mt: 0.25 }}>
          {subValue}
        </Typography>
      )}
    </Box>
  );
}
