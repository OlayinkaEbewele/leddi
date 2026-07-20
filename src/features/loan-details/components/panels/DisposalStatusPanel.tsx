import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import type { DisposalStatus } from '@/api/types';
import { textMuted, textPrimary } from '@/theme/theme';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDisplayDate } from '@/utils/formatDate';

interface DisposalStatusPanelProps {
  disposal: DisposalStatus;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, py: 0.5 }}>
      <Typography variant="caption" sx={{ color: textMuted }}>
        {label}
      </Typography>
      <Typography variant="caption" sx={{ color: textPrimary, fontWeight: 600, textAlign: 'right' }}>
        {value}
      </Typography>
    </Box>
  );
}

export function DisposalStatusPanel({ disposal }: DisposalStatusPanelProps) {
  const { t } = useTranslation();

  // TODO(real): pull from Mist API
  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: '10px',
        bgcolor: '#FFF4E6',
        border: '1px solid #EA580C',
      }}
    >
      <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 1.25 }}>
        <Inventory2OutlinedIcon sx={{ fontSize: 18, color: '#EA580C' }} />
        <Typography sx={{ fontWeight: 700, fontSize: '0.8125rem', color: textPrimary }}>
          {t('loanDetails.panels.disposal.title')}
        </Typography>
      </Stack>
      <Stack spacing={0.25}>
        <Row
          label={t('loanDetails.panels.disposal.listedDate')}
          value={formatDisplayDate(disposal.listedDate)}
        />
        <Row label={t('loanDetails.panels.disposal.status')} value={disposal.status} />
        <Row
          label={t('loanDetails.panels.disposal.estimatedValue')}
          value={formatCurrency(disposal.estimatedValue, disposal.currency)}
        />
        <Row label={t('loanDetails.panels.disposal.officer')} value={disposal.disposalOfficer} />
      </Stack>
    </Box>
  );
}
