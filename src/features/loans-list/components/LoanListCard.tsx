import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { LoanListItem } from '@/api/types';
import { ValueTag } from '@/components/ValueTag';
import { getDashboardActionButtonSx } from '@/features/dashboard/dashboardTheme';
import { useThemeMode } from '@/theme/ThemeModeProvider';
import {
  borderSubtle,
  cardShadow,
  riskStage3,
  surface,
  textMuted,
  textPrimary,
  textSecondary,
} from '@/theme/theme';
import { copyToClipboard } from '@/utils/copyToClipboard';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDisplayDate } from '@/utils/formatDate';
import { getLoanCardStripeColor, showNplBadge } from '../utils/loanListCardUtils';

interface LoanListCardProps {
  loan: LoanListItem;
  onCopyId?: () => void;
}

export function LoanListCard({ loan, onCopyId }: LoanListCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mode } = useThemeMode();
  const actionButtonSx = getDashboardActionButtonSx(mode);
  const stripeColor = getLoanCardStripeColor(loan);
  const hasArrears = Math.abs(loan.arrearsBalance) > 0;
  const loanCount = loan.customerLoanCount ?? 1;

  const handleCopyId = () => {
    void copyToClipboard(loan.acquireId).then((copied) => {
      if (copied) onCopyId?.();
    });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'stretch',
        bgcolor: surface,
        border: `1px solid ${borderSubtle}`,
        borderRadius: '10px',
        boxShadow: cardShadow,
        overflow: 'hidden',
        mb: 1.5,
      }}
    >
      <Box sx={{ width: 4, bgcolor: stripeColor, flexShrink: 0 }} />

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 2, md: 3 },
          p: 2,
          minWidth: 0,
          flexWrap: { xs: 'wrap', lg: 'nowrap' },
        }}
      >
        <Box sx={{ flex: 1.4, minWidth: 0 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ flexWrap: 'wrap', mb: 0.75 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', color: textPrimary }}>
              {loan.customerName}
            </Typography>
            <Box
              sx={{
                px: 1,
                py: 0.25,
                borderRadius: '20px',
                bgcolor: '#E6F1FB',
                color: '#185FA5',
                fontSize: '0.6875rem',
                fontWeight: 600,
              }}
            >
              {loanCount === 1
                ? t('loans.card.loanCountOne', { count: loanCount })
                : t('loans.card.loanCount', { count: loanCount })}
            </Box>
            {showNplBadge(loan) && (
              <Box
                sx={{
                  px: 0.75,
                  py: 0.25,
                  borderRadius: '6px',
                  bgcolor: '#FCEAEA',
                  color: riskStage3,
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                }}
              >
                NPL
              </Box>
            )}
            <ValueTag value={loan.operationalStatus.status} />
            {loan.ifrsStatus !== null && loan.ifrsStatus > 0 && (
              <Box
                sx={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  bgcolor: riskStage3,
                  color: '#fff',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {loan.ifrsStatus}
              </Box>
            )}
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1} sx={{ flexWrap: 'wrap', gap: 0.75 }}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Typography variant="caption" sx={{ color: textSecondary, fontSize: '0.75rem' }}>
                {loan.acquireId}
              </Typography>
              <Tooltip title={t('loans.card.copyId')}>
                <IconButton size="small" onClick={handleCopyId} sx={{ p: 0.25 }}>
                  <ContentCopyOutlinedIcon sx={{ fontSize: 14, color: textMuted }} />
                </IconButton>
              </Tooltip>
            </Stack>
            <ValueTag value={loan.structureCode} />
            <ValueTag value={loan.classification} />
            <ValueTag value={loan.loanCategory} />
            <Typography variant="caption" sx={{ color: textMuted }}>
              · {loan.car}
            </Typography>
          </Stack>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(88px, 1fr))',
            gap: 2,
            flexShrink: 0,
            minWidth: { md: 280 },
          }}
        >
          <MetricColumn
            label={t('loans.card.arrears')}
            value={
              hasArrears ? (
                <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', color: riskStage3 }}>
                  {formatCurrency(Math.abs(loan.arrearsBalance), loan.currency)}
                </Typography>
              ) : (
                <Typography sx={{ color: textMuted }}>—</Typography>
              )
            }
          />
          <MetricColumn
            label={t('loans.card.exposure')}
            value={
              <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', color: textPrimary }}>
                {formatCurrency(loan.totalExposure, loan.currency)}
              </Typography>
            }
          />
          <MetricColumn
            label={t('loans.card.nextInstal')}
            value={
              <Typography sx={{ fontSize: '0.8125rem', color: textSecondary }}>
                {formatDisplayDate(loan.nextInstallmentDate)}
              </Typography>
            }
          />
        </Box>

        <Button
          variant="contained"
          size="small"
          onClick={() => {
            navigate(`/prime/loans/${loan.acquireId}`);
          }}
          sx={{ ...actionButtonSx, flexShrink: 0, alignSelf: 'center' }}
        >
          {t('loans.card.openLoan')}
        </Button>
      </Box>
    </Box>
  );
}

function MetricColumn({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Box>
      <Typography
        variant="microLabel"
        sx={{ display: 'block', mb: 0.5, color: textMuted, fontSize: '0.625rem' }}
      >
        {label}
      </Typography>
      {value}
    </Box>
  );
}
