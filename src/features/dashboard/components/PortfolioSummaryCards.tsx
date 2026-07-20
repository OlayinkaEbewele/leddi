import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import type { DashboardSummary, DashboardTrend } from '@/api/types';
import { textMuted } from '@/theme/theme';
import { useThemeMode } from '@/theme/ThemeModeProvider';
import { formatCompactCurrency } from '../utils/dashboardUtils';
import { getSummaryCardSx, getTrendColor, SUMMARY_GRID_SX } from '../dashboardTheme';

interface PortfolioSummaryCardsProps {
  summary: DashboardSummary | undefined;
  loading: boolean;
  portfolioSubtitle: string;
}

function TrendLine({ trend, mode }: { trend: DashboardTrend; mode: 'light' | 'dark' }) {
  const { t } = useTranslation();
  const arrow = trend.direction === 'up' ? '▲' : '▼';
  const color = getTrendColor(trend.sentiment, mode);

  return (
    <Typography
      sx={{
        fontSize: '0.75rem',
        fontWeight: 500,
        color,
        display: 'flex',
        alignItems: 'center',
        gap: 0.25,
        mt: 0.75,
      }}
    >
      {arrow} {trend.deltaPercent.toFixed(1)}% {t('dashboard.summary.vsLastMonth')}
    </Typography>
  );
}

export function PortfolioSummaryCards({
  summary,
  loading,
  portfolioSubtitle,
}: PortfolioSummaryCardsProps) {
  const { t } = useTranslation();
  const { mode } = useThemeMode();
  const summaryCardSx = getSummaryCardSx(mode);

  const cards = [
    {
      label: t('dashboard.summary.totalActiveLoans'),
      value: summary ? summary.totalActiveLoans.toLocaleString() : '',
      footer: summary?.trends.totalActiveLoans ? (
        <TrendLine trend={summary.trends.totalActiveLoans} mode={mode} />
      ) : null,
    },
    {
      label: t('dashboard.summary.totalExposure'),
      value: summary ? formatCompactCurrency(summary.totalExposure, summary.currency) : '',
      footer: (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.75 }}>
          {portfolioSubtitle}
        </Typography>
      ),
    },
    {
      label: t('dashboard.summary.totalArrears'),
      value: summary ? formatCompactCurrency(summary.totalArrears, summary.currency) : '',
      footer: summary?.trends.totalArrears ? (
        <TrendLine trend={summary.trends.totalArrears} mode={mode} />
      ) : null,
    },
    {
      label: t('dashboard.summary.collectionRate'),
      value: summary ? `${summary.collectionRate.toFixed(1)}%` : '',
      footer: summary?.trends.collectionRate ? (
        <TrendLine trend={summary.trends.collectionRate} mode={mode} />
      ) : null,
    },
  ];

  return (
    <Box sx={SUMMARY_GRID_SX}>
      {cards.map((card) => (
        <Box key={card.label} sx={summaryCardSx}>
          {loading ? (
            <>
              <Skeleton width="60%" height={14} />
              <Skeleton width="50%" height={36} sx={{ mt: 1 }} />
              <Skeleton width="40%" height={12} sx={{ mt: 0.75 }} />
            </>
          ) : (
            <>
              <Typography variant="microLabel" sx={{ color: textMuted }}>
                {card.label}
              </Typography>
              <Typography sx={{ fontSize: '1.875rem', fontWeight: 700, lineHeight: 1.15, mt: 0.75 }}>
                {card.value}
              </Typography>
              {card.footer}
            </>
          )}
        </Box>
      ))}
    </Box>
  );
}
