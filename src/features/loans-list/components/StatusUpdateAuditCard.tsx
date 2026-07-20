import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import type { StatusUpdateAuditEntry } from '@/api/types';
import {
  borderSubtle,
  cardRadius,
  cardShadow,
  getChipSx,
  pageBackground,
  surface,
  textMuted,
  textPrimary,
  textSecondary,
} from '@/theme/theme';
import { copyToClipboard } from '@/utils/copyToClipboard';
import { StatusValueTag } from './StatusValueTag';

interface StatusUpdateAuditCardProps {
  entry: StatusUpdateAuditEntry;
}

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function formatActionAt(iso: string): string {
  try {
    return format(new Date(iso), 'd MMM yyyy, HH:mm');
  } catch {
    return iso;
  }
}

export function StatusUpdateAuditCard({ entry }: StatusUpdateAuditCardProps) {
  const { t } = useTranslation();
  const isConfirmed = entry.action === 'CONFIRMED';
  const actionTone = isConfirmed ? 'riskStage1' : 'riskStage3';

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        bgcolor: surface,
        border: `1px solid ${borderSubtle}`,
        borderRadius: `${cardRadius}px`,
        boxShadow: cardShadow,
        height: '100%',
      }}
    >
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 2 }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: pageBackground,
              color: textPrimary,
              fontWeight: 700,
              fontSize: '0.8125rem',
              border: `1px solid ${borderSubtle}`,
            }}
          >
            {initialsFromName(entry.actionBy)}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', color: textPrimary }}>
              {entry.actionBy}
            </Typography>
            <Typography variant="caption" sx={{ color: textSecondary }}>
              {t('statusUpdates.audit.actionAt', { date: formatActionAt(entry.actionAt) })}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ flexShrink: 0, ml: 1 }}>
          <Chip
            label={t(`statusUpdates.audit.action.${entry.action.toLowerCase()}`)}
            size="small"
            sx={{ ...getChipSx(actionTone), fontWeight: 700, fontSize: '0.6875rem' }}
          />
          <Box
            sx={{
              px: 1.25,
              py: 0.5,
              borderRadius: '20px',
              bgcolor: pageBackground,
              border: `1px solid ${borderSubtle}`,
              fontSize: '0.75rem',
              fontWeight: 600,
              color: textPrimary,
            }}
          >
            {entry.acquireId}
          </Box>
          <Tooltip title={t('loans.card.copyId')}>
            <IconButton
              size="small"
              onClick={() => void copyToClipboard(entry.acquireId)}
              sx={{ p: 0.5 }}
            >
              <ContentCopyOutlinedIcon sx={{ fontSize: 14, color: textMuted }} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr auto',
          gap: 1.5,
          alignItems: 'end',
          mb: 2,
        }}
      >
        <AuditFlowCell label={t('statusUpdates.audit.previous')} value={entry.previousStatus} />
        <ArrowForwardIcon sx={{ color: textMuted, fontSize: 18, mb: 0.5 }} />
        <AuditFlowCell label={t('statusUpdates.audit.newStatus')} value={entry.newStatus} />
        <AuditFlowCell
          label={t('statusUpdates.beforeRequest')}
          value={entry.beforeRequestStatus}
          align="right"
        />
      </Box>

      <Box
        sx={{
          px: 1.5,
          py: 1.25,
          borderRadius: '8px',
          bgcolor: pageBackground,
          border: `1px solid ${borderSubtle}`,
        }}
      >
        <Typography variant="body2" sx={{ color: textSecondary, fontSize: '0.8125rem', lineHeight: 1.5 }}>
          {entry.reason}
        </Typography>
      </Box>
    </Paper>
  );
}

function AuditFlowCell({
  label,
  value,
  align = 'left',
}: {
  label: string;
  value: string;
  align?: 'left' | 'right';
}) {
  return (
    <Box sx={{ textAlign: align }}>
      <Typography
        variant="microLabel"
        sx={{ display: 'block', mb: 0.75, color: textMuted, fontSize: '0.625rem' }}
      >
        {label}
      </Typography>
      <StatusValueTag value={value} />
    </Box>
  );
}
