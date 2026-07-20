import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import type { DashboardPriorityTier, DashboardWorklistItem } from '@/api/types';
import { borderSubtle, surface } from '@/theme/theme';
import { useThemeMode } from '@/theme/ThemeModeProvider';
import { DashboardSectionHeader } from './DashboardSectionHeader';
import {
  getDashboardActionButtonSx,
  getDashboardBucketTones,
  getDashboardLinkSx,
  type DashboardLayoutMode,
} from '../dashboardTheme';

interface PriorityWorklistProps {
  items: DashboardWorklistItem[] | undefined;
  totalLoanCount: number;
  loading: boolean;
  layoutMode: DashboardLayoutMode;
}

function tierTone(tier: DashboardPriorityTier, mode: 'light' | 'dark') {
  const tones = getDashboardBucketTones(mode);
  if (tier === 'critical') return tones.critical;
  if (tier === 'warning') return tones.warning;
  return tones.neutral;
}

function WorklistRow({
  item,
  layoutMode,
  mode,
}: {
  item: DashboardWorklistItem;
  layoutMode: DashboardLayoutMode;
  mode: 'light' | 'dark';
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const tone = tierTone(item.priorityTier, mode);
  const actionButtonSx = getDashboardActionButtonSx(mode);
  const showStripe = layoutMode === 'stripe';

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: 2,
        py: 1.5,
        borderTop: `0.5px solid ${borderSubtle}`,
        '&:first-of-type': { borderTop: 'none' },
      }}
    >
      {showStripe && (
        <Box
          sx={{
            width: 4,
            alignSelf: 'stretch',
            borderRadius: 1,
            bgcolor: tone.stripe,
            flexShrink: 0,
          }}
        />
      )}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Typography sx={{ fontWeight: 700, fontSize: '0.875rem' }}>
            {item.loan.customerName}
          </Typography>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              fontSize: '0.6875rem',
              fontWeight: 600,
              px: 1,
              py: 0.25,
              borderRadius: '20px',
              bgcolor: tone.bg,
              color: tone.label,
            }}
          >
            <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: tone.dot }} />
            {item.reasonLabel}
          </Box>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
          {item.loan.acquireId} · {item.loan.structureCode} · {item.loan.loanCategory}
        </Typography>
      </Box>
      <Button
        size="small"
        variant="contained"
        onClick={() => {
          navigate(`/prime/loans/${item.loan.acquireId}`);
        }}
        sx={{ ...actionButtonSx, flexShrink: 0 }}
      >
        {t('dashboard.worklist.openLoan')}
      </Button>
    </Box>
  );
}

function WorklistSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <Box key={i} sx={{ px: 2, py: 1.5, borderTop: i > 0 ? `0.5px solid ${borderSubtle}` : 'none' }}>
          <Skeleton width="40%" height={16} />
          <Skeleton width="70%" height={12} sx={{ mt: 0.75 }} />
        </Box>
      ))}
    </>
  );
}

export function PriorityWorklist({
  items,
  totalLoanCount,
  loading,
  layoutMode,
}: PriorityWorklistProps) {
  const { t } = useTranslation();
  const { mode } = useThemeMode();
  const linkSx = getDashboardLinkSx(mode);

  return (
    <Box>
      <DashboardSectionHeader
        overline={t('dashboard.sections.today')}
        title={t('dashboard.worklist.title')}
      />

      <Box
        sx={{
          border: `0.5px solid ${borderSubtle}`,
          borderRadius: '10px',
          bgcolor: surface,
          overflow: 'hidden',
        }}
      >
        {loading ? (
          <WorklistSkeleton />
        ) : items && items.length > 0 ? (
          items.map((item) => (
            <WorklistRow key={item.loan.acquireId} item={item} layoutMode={layoutMode} mode={mode} />
          ))
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
            {t('dashboard.worklist.empty')}
          </Typography>
        )}
      </Box>

      <Typography
        component={RouterLink}
        to="/prime/loans"
        sx={{ ...linkSx, display: 'inline-block', mt: 2 }}
      >
        {t('dashboard.worklist.viewAll', { count: totalLoanCount.toLocaleString() })}
      </Typography>
    </Box>
  );
}
