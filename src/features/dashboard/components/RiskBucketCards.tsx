import NorthEastIcon from '@mui/icons-material/NorthEast';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { DashboardSummary } from '@/api/types';
import { borderSubtle, surface } from '@/theme/theme';
import { useThemeMode } from '@/theme/ThemeModeProvider';
import { DashboardLayoutToggle } from './DashboardLayoutToggle';
import { DashboardSectionHeader } from './DashboardSectionHeader';
import {
  BUCKET_GRID_SX,
  getDashboardBucketTones,
  type DashboardLayoutMode,
} from '../dashboardTheme';
import {
  formatExposureSub,
  formatPromisedSub,
  getBucketNavigatePath,
  type DashboardBucketKey,
} from '../utils/dashboardUtils';

interface RiskBucketCardsProps {
  summary: DashboardSummary | undefined;
  loading: boolean;
  layoutMode: DashboardLayoutMode;
  onLayoutModeChange: (mode: DashboardLayoutMode) => void;
}

interface BucketConfig {
  key: DashboardBucketKey;
  labelKey: string;
  tone: 'critical' | 'warning' | 'ptp' | 'neutral' | 'info' | 'infoDark';
  subKey?: string;
  subValue?: (summary: DashboardSummary) => string;
}

const BUCKETS: BucketConfig[] = [
  {
    key: 'stage3Overdue',
    labelKey: 'dashboard.buckets.stage3Overdue',
    tone: 'critical',
    subValue: (s) => formatExposureSub(s.buckets.stage3Overdue.exposure ?? 0, s.currency),
  },
  {
    key: 'missedPayment',
    labelKey: 'dashboard.buckets.missedPayment',
    tone: 'warning',
    subValue: (s) => formatExposureSub(s.buckets.missedPayment.exposure ?? 0, s.currency),
  },
  {
    key: 'ptpDueToday',
    labelKey: 'dashboard.buckets.ptpDueToday',
    tone: 'ptp',
    subValue: (s) => formatPromisedSub(s.buckets.ptpDueToday.totalPromised ?? 0, s.currency),
  },
  {
    key: 'staleDemandNotice',
    labelKey: 'dashboard.buckets.staleDemandNotice',
    tone: 'neutral',
    subKey: 'dashboard.buckets.staleSub',
  },
  {
    key: 'pendingRestructure',
    labelKey: 'dashboard.buckets.pendingRestructure',
    tone: 'info',
    subKey: 'dashboard.buckets.awaitingApproval',
  },
  {
    key: 'pendingStatusUpdates',
    labelKey: 'dashboard.buckets.pendingStatusUpdates',
    tone: 'infoDark',
    subKey: 'dashboard.buckets.needsReview',
  },
];

export function RiskBucketCards({
  summary,
  loading,
  layoutMode,
  onLayoutModeChange,
}: RiskBucketCardsProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mode } = useThemeMode();
  const bucketTones = getDashboardBucketTones(mode);
  const isStripe = layoutMode === 'stripe';

  return (
    <Box>
      <DashboardSectionHeader
        overline={t('dashboard.sections.needsAttention')}
        title={t('dashboard.sections.riskBuckets')}
        action={<DashboardLayoutToggle value={layoutMode} onChange={onLayoutModeChange} />}
      />

      <Box sx={BUCKET_GRID_SX}>
        {BUCKETS.map((bucket) => {
          const tone = bucketTones[bucket.tone];
          const count = summary?.buckets[bucket.key].count;
          const subText = summary
            ? bucket.subValue
              ? bucket.subValue(summary)
              : t(bucket.subKey!)
            : '';

          return (
            <Box
              key={bucket.key}
              component="button"
              type="button"
              onClick={() => {
                navigate(getBucketNavigatePath(bucket.key));
              }}
              sx={{
                position: 'relative',
                textAlign: 'left',
                cursor: 'pointer',
                border: isStripe ? `1px solid ${mode === 'dark' ? tone.border : borderSubtle}` : 'none',
                bgcolor: isStripe ? surface : tone.bg,
                borderRadius: '10px',
                p: 2,
                minHeight: 112,
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                overflow: 'hidden',
                ...(isStripe && {
                  borderLeft: `4px solid ${tone.stripe}`,
                }),
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: '0 2px 8px rgba(46, 49, 98, 0.08)',
                },
              }}
            >
              <NorthEastIcon
                sx={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  fontSize: 16,
                  color: tone.label,
                  opacity: 0.7,
                }}
              />

              {loading ? (
                <>
                  <Skeleton width="70%" height={14} />
                  <Skeleton width="30%" height={32} sx={{ mt: 1 }} />
                  <Skeleton width="50%" height={12} sx={{ mt: 0.75 }} />
                </>
              ) : (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, pr: 2 }}>
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        bgcolor: tone.dot,
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      variant="microLabel"
                      sx={{ color: tone.label, display: 'block', fontWeight: 600 }}
                    >
                      {t(bucket.labelKey)}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{ fontSize: '1.875rem', fontWeight: 700, color: tone.count, mt: 0.75 }}
                  >
                    {count ?? 0}
                  </Typography>
                  <Typography variant="caption" sx={{ color: tone.label, display: 'block', mt: 0.5 }}>
                    {subText}
                  </Typography>
                </>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
