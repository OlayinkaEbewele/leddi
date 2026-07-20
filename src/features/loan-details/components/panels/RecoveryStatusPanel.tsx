import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import type { RecoveryStatus } from '@/api/types';
import { dm } from '@/theme/darkModeTokens';
import { chipTones, riskStage1, textMuted, textPrimary } from '@/theme/theme';
import { useThemeMode } from '@/theme/ThemeModeProvider';
import { formatDisplayDate } from '@/utils/formatDate';

interface RecoveryStatusPanelProps {
  recovery: RecoveryStatus;
}

function statusChip(recovery: RecoveryStatus, t: (key: string) => string, isDark: boolean) {
  if (recovery.status === 'APPROVED') {
    const tone = isDark ? chipTones.riskStage1 : { bg: '#E6F5ED', color: riskStage1 };
    return (
      <Stack direction="row" spacing={0.5} alignItems="center">
        <CheckCircleOutlineIcon sx={{ fontSize: 16, color: tone.color }} />
        <Chip
          label={t('loanDetails.panels.recovery.approved')}
          size="small"
          sx={{ bgcolor: tone.bg, color: tone.color, fontWeight: 600, fontSize: '0.6875rem' }}
        />
      </Stack>
    );
  }
  if (recovery.status === 'REQUESTED') {
    return (
      <Chip
        label={t('loanDetails.panels.recovery.pending')}
        size="small"
        sx={{
          bgcolor: isDark ? dm.warningBg : '#FEF3CD',
          color: isDark ? dm.warning : '#D97706',
          fontWeight: 600,
          fontSize: '0.6875rem',
        }}
      />
    );
  }
  if (recovery.status === 'CANCELLED') {
    return (
      <Chip
        label={t('loanDetails.panels.recovery.cancelled')}
        size="small"
        sx={{
          bgcolor: isDark ? dm.neutralBg : '#F1EFE8',
          color: isDark ? dm.neutralText : '#5F5E5A',
          fontWeight: 600,
          fontSize: '0.6875rem',
        }}
      />
    );
  }
  return <Chip label={recovery.status} size="small" />;
}

function PanelRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, py: 0.5 }}>
      <Typography variant="caption" sx={{ color: textMuted, flexShrink: 0 }}>
        {label}
      </Typography>
      <Box sx={{ textAlign: 'right', minWidth: 0 }}>
        {typeof value === 'string' ? (
          <Typography variant="caption" sx={{ color: textPrimary, fontWeight: 600 }}>
            {value}
          </Typography>
        ) : (
          value
        )}
      </Box>
    </Box>
  );
}

export function RecoveryStatusPanel({ recovery }: RecoveryStatusPanelProps) {
  const { t } = useTranslation();
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';
  const decisionDate =
    recovery.approvedAt ?? recovery.rejectedAt ?? recovery.cancelledAt ?? null;

  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: '10px',
        bgcolor: isDark ? dm.warningBg : '#FEF3CD',
        border: `1px solid ${isDark ? dm.warningBorder : '#D97706'}`,
      }}
    >
      <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 1.25 }}>
        <LocalShippingOutlinedIcon sx={{ fontSize: 18, color: isDark ? dm.warning : '#D97706' }} />
        <Typography sx={{ fontWeight: 700, fontSize: '0.8125rem', color: isDark ? dm.warning : textPrimary }}>
          {t('loanDetails.panels.recovery.title')}
        </Typography>
      </Stack>
      <Stack spacing={0.25}>
        <PanelRow label={t('loanDetails.panels.recovery.status')} value={statusChip(recovery, t, isDark)} />
        <PanelRow
          label={t('loanDetails.panels.recovery.requestedDate')}
          value={formatDisplayDate(recovery.requestedAt)}
        />
        {recovery.requestedBy && (
          <PanelRow label={t('loanDetails.panels.recovery.requestedBy')} value={recovery.requestedBy} />
        )}
        {decisionDate && (
          <PanelRow
            label={t('loanDetails.panels.recovery.decisionDate')}
            value={formatDisplayDate(decisionDate)}
          />
        )}
        {recovery.reason && (
          <PanelRow label={t('loanDetails.panels.recovery.reason')} value={recovery.reason} />
        )}
      </Stack>
    </Box>
  );
}
