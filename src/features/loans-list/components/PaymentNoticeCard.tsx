import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import type { PaymentNotice } from '@/api/types';
import { CheckIcon, CopyIcon, DownloadIcon, ExternalLinkIcon } from '@/components/animate-ui-icons';
import { ValueTag } from '@/components/ValueTag';
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
import { formatCurrency } from '@/utils/formatCurrency';
import { confirmButtonSx, deleteRequestButtonSx } from './StatusUpdateActionDialogs';
import { StatusValueTag } from './StatusValueTag';

interface PaymentNoticeCardProps {
  notice: PaymentNotice;
  variant: 'PENDING' | 'ALLOCATED';
  onConfirm?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  onDownload?: () => void;
  onOpenLoan?: () => void;
}

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function formatStamp(iso: string): string {
  try {
    return format(new Date(iso), 'd MMM yyyy, HH:mm');
  } catch {
    return iso;
  }
}

export function PaymentNoticeCard({
  notice,
  variant,
  onConfirm,
  onDelete,
  onEdit,
  onDownload,
  onOpenLoan,
}: PaymentNoticeCardProps) {
  const { t } = useTranslation();
  const isAllocated = variant === 'ALLOCATED';

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
            {initialsFromName(notice.createdBy)}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', color: textPrimary }}>
              {notice.createdBy}
            </Typography>
            <Typography variant="caption" sx={{ color: textSecondary, display: 'block' }}>
              {t('paymentNotices.createdAtCaption', { date: formatStamp(notice.createdAt) })}
            </Typography>
            <Typography variant="caption" sx={{ color: textMuted }}>
              {t('paymentNotices.forCustomer', { name: notice.customerName })}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ flexShrink: 0, ml: 1 }}>
          {isAllocated && (
            <Chip
              label={t('paymentNotices.allocation.allocated')}
              size="small"
              sx={{ ...getChipSx('riskStage1'), fontWeight: 700, fontSize: '0.6875rem' }}
            />
          )}
          {!isAllocated && (
            <Tooltip title={t('paymentNotices.actions.editRequest')}>
              <IconButton size="small" onClick={onEdit} aria-label={t('paymentNotices.actions.editRequest')}>
                <EditOutlinedIcon sx={{ fontSize: 18, color: textMuted }} />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      </Stack>

      <Box sx={{ mb: 1.75 }}>
        <Typography
          variant="microLabel"
          sx={{ display: 'block', mb: 0.5, color: textMuted, fontSize: '0.625rem' }}
        >
          {t('paymentNotices.columns.amount')}
        </Typography>
        <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: textPrimary, lineHeight: 1.2 }}>
          {formatCurrency(notice.amount, notice.currency)}
        </Typography>
      </Box>

      <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap" sx={{ mb: 1.75 }}>
        <ValueTag value={notice.product} />
        <ValueTag value={notice.type} />
        <ValueTag value={notice.country} />
        <StatusValueTag value={notice.loanStatus} />
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 1.5,
          mb: 1.75,
        }}
      >
        <AcquireIdCell acquireId={notice.acquireId} />
        <MetaCell label={t('paymentNotices.columns.id')} value={notice.id} />
        <MetaCell label={t('paymentNotices.columns.reference')} value={notice.reference} />
        {isAllocated && notice.paidAt ? (
          <MetaCell label={t('paymentNotices.columns.paidAt')} value={formatStamp(notice.paidAt)} />
        ) : null}
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
          {notice.narrative}
        </Typography>
      </Box>

      {isAllocated ? (
        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<DownloadIcon size={18} animateOnHover />}
            onClick={onDownload}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            {t('paymentNotices.actions.downloadProof')}
          </Button>
          <Button
            variant="contained"
            fullWidth
            startIcon={<ExternalLinkIcon size={18} animateOnHover />}
            onClick={onOpenLoan}
            sx={{ ...confirmButtonSx, minWidth: 0 }}
          >
            {t('paymentNotices.actions.openLoan')}
          </Button>
        </Stack>
      ) : (
        <Stack direction="row" spacing={1.5}>
          <Button variant="outlined" fullWidth onClick={onDelete} sx={deleteRequestButtonSx}>
            {t('paymentNotices.actions.deleteRequest')}
          </Button>
          <Button
            variant="contained"
            fullWidth
            startIcon={<CheckIcon size={18} animateOnHover />}
            onClick={onConfirm}
            sx={confirmButtonSx}
          >
            {t('paymentNotices.actions.confirm')}
          </Button>
        </Stack>
      )}
    </Paper>
  );
}

function AcquireIdCell({ acquireId }: { acquireId: string }) {
  const { t } = useTranslation();

  return (
    <Box>
      <Typography
        variant="microLabel"
        sx={{ display: 'block', mb: 0.5, color: textMuted, fontSize: '0.625rem' }}
      >
        {t('loans.columns.acquireId')}
      </Typography>
      <Stack direction="row" alignItems="center" spacing={0.25} sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: '0.8125rem',
            color: textPrimary,
            wordBreak: 'break-word',
          }}
        >
          {acquireId}
        </Typography>
        <Tooltip title={t('loans.card.copyId')}>
          <IconButton
            size="small"
            onClick={() => void copyToClipboard(acquireId)}
            sx={{ p: 0.25 }}
            aria-label={t('loans.card.copyId')}
          >
            <CopyIcon size={14} animateOnHover style={{ color: textMuted }} />
          </IconButton>
        </Tooltip>
      </Stack>
    </Box>
  );
}

function MetaCell({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography
        variant="microLabel"
        sx={{ display: 'block', mb: 0.5, color: textMuted, fontSize: '0.625rem' }}
      >
        {label}
      </Typography>
      <Typography sx={{ fontWeight: 600, fontSize: '0.8125rem', color: textPrimary, wordBreak: 'break-word' }}>
        {value}
      </Typography>
    </Box>
  );
}
