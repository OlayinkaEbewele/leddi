import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { LoanDetails } from '@/api/types';
import type { ActionKey } from '@/auth/roles';
import { borderSubtle, pagePaddingX, surface, textPrimary, textSecondary } from '@/theme/theme';
import { LoanDetailsTopBarActions } from './LoanDetailsTopBarActions';

interface LoanDetailsStickyBarProps {
  loan: LoanDetails;
  onReload?: () => void;
  onAction: (actionKey: ActionKey) => void;
  onMoreActions: () => void;
  reloading?: boolean;
}

export function LoanDetailsStickyBar({
  loan,
  onReload,
  onAction,
  onMoreActions,
  reloading,
}: LoanDetailsStickyBarProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/prime/loans');
  };

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1100,
        bgcolor: surface,
        borderBottom: `1px solid ${borderSubtle}`,
        mb: 2.5,
        boxShadow: '0 1px 3px rgba(46, 49, 98, 0.06)',
        px: pagePaddingX,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap={2}
        sx={{ minHeight: 56, py: 1.25 }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ minWidth: 0 }}>
          <IconButton
            size="small"
            onClick={handleBack}
            aria-label={t('nav.backToLoans')}
            sx={{
              border: `1px solid ${borderSubtle}`,
              borderRadius: '8px',
              color: textPrimary,
            }}
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', lineHeight: 1.3 }} noWrap>
              {loan.customer.fullName}
            </Typography>
            <Typography variant="caption" sx={{ color: textSecondary }} noWrap>
              {loan.acquireId}
            </Typography>
          </Box>
        </Stack>

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ flexShrink: 0, flexWrap: 'wrap' }}
          useFlexGap
        >
          <LoanDetailsTopBarActions loan={loan} onAction={onAction} onMoreActions={onMoreActions} />
          <Button
            variant="outlined"
            size="small"
            startIcon={<RefreshIcon sx={{ fontSize: 16 }} />}
            onClick={onReload}
            disabled={reloading}
            sx={{ textTransform: 'none', fontWeight: 600, ml: 'auto' }}
          >
            {t('loanDetails.statuses.reload')}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
