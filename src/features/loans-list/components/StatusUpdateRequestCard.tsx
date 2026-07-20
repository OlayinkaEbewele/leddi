import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import ViewModuleOutlinedIcon from '@mui/icons-material/ViewModuleOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import type { StatusUpdateRequest } from '@/api/types';
import { ArrowRightIcon, CheckIcon, CopyIcon } from '@/components/animate-ui-icons';
import {
  borderSubtle,
  cardRadius,
  cardShadow,
  pageBackground,
  riskStage1,
  surface,
  textMuted,
  textPrimary,
  textSecondary,
} from '@/theme/theme';
import { copyToClipboard } from '@/utils/copyToClipboard';
import { confirmButtonSx, rejectButtonSx } from './StatusUpdateActionDialogs';
import { StatusValueTag } from './StatusValueTag';

interface StatusUpdateRequestCardProps {
  request: StatusUpdateRequest;
  onConfirm: () => void;
  onReject: () => void;
}

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function formatRequestedAt(iso: string): string {
  try {
    return format(new Date(iso), 'd MMM yyyy, HH:mm');
  } catch {
    return iso;
  }
}

export function StatusUpdateRequestCard({ request, onConfirm, onReject }: StatusUpdateRequestCardProps) {
  const { t } = useTranslation();

  const handleCopyId = () => {
    void copyToClipboard(request.acquireId);
  };

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
        display: 'flex',
        flexDirection: 'column',
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
            {initialsFromName(request.requestedBy)}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', color: textPrimary }}>
              {request.requestedBy}
            </Typography>
            <Typography variant="caption" sx={{ color: textSecondary }}>
              {t('statusUpdates.requestedAt', { date: formatRequestedAt(request.requestedAt) })}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ flexShrink: 0, ml: 1 }}>
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
            {request.acquireId}
          </Box>
          <Tooltip title={t('loans.card.copyId')}>
            <IconButton size="small" onClick={handleCopyId} sx={{ p: 0.5 }}>
              <CopyIcon size={14} animateOnHover style={{ color: textMuted }} />
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
        <StatusFlowCell label={t('statusUpdates.current')} value={request.currentStatus} />
        <ArrowRightIcon size={18} animateOnHover style={{ color: textMuted, marginBottom: 4 }} />
        <StatusFlowCell label={t('statusUpdates.requested')} value={request.requestedStatus} />
        <StatusFlowCell
          label={t('statusUpdates.beforeRequest')}
          value={request.beforeRequestStatus}
          align="right"
        />
      </Box>

      <Box
        sx={{
          flex: 1,
          px: 1.5,
          py: 1.25,
          mb: 2,
          borderRadius: '8px',
          bgcolor: pageBackground,
          border: `1px solid ${borderSubtle}`,
        }}
      >
        <Typography variant="body2" sx={{ color: textSecondary, fontSize: '0.8125rem', lineHeight: 1.5 }}>
          {request.reason}
        </Typography>
      </Box>

      <Stack direction="row" spacing={1.5}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<CheckIcon size={18} animateOnHover />}
          onClick={onConfirm}
          sx={confirmButtonSx}
        >
          {t('statusUpdates.actions.confirm')}
        </Button>
        <Button variant="outlined" fullWidth onClick={onReject} sx={rejectButtonSx}>
          {t('statusUpdates.actions.reject')}
        </Button>
      </Stack>
    </Paper>
  );
}

function StatusFlowCell({
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

export function StatusUpdatesGridToggle({
  columns,
  onChange,
}: {
  columns: 2 | 3;
  onChange: (columns: 2 | 3) => void;
}) {
  const { t } = useTranslation();

  return (
    <Stack direction="row" spacing={0.5} alignItems="center">
      <Tooltip title={t('statusUpdates.grid.twoByTwo')}>
        <IconButton
          size="small"
          onClick={() => onChange(2)}
          aria-label={t('statusUpdates.grid.twoByTwo')}
          sx={{
            border: `1px solid ${columns === 2 ? riskStage1 : borderSubtle}`,
            borderRadius: '8px',
            bgcolor: columns === 2 ? 'rgba(74, 124, 89, 0.08)' : 'transparent',
            color: columns === 2 ? riskStage1 : textMuted,
          }}
        >
          <GridViewOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title={t('statusUpdates.grid.threeByTwo')}>
        <IconButton
          size="small"
          onClick={() => onChange(3)}
          aria-label={t('statusUpdates.grid.threeByTwo')}
          sx={{
            border: `1px solid ${columns === 3 ? riskStage1 : borderSubtle}`,
            borderRadius: '8px',
            bgcolor: columns === 3 ? 'rgba(74, 124, 89, 0.08)' : 'transparent',
            color: columns === 3 ? riskStage1 : textMuted,
          }}
        >
          <ViewModuleOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}
