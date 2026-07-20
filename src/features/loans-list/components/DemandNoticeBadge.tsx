import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { negativeDelta } from '@/theme/theme';
import { formatDate } from '@/utils/formatDate';

interface DemandNoticeBadgeProps {
  date: string | null;
  isStale: boolean;
}

export function DemandNoticeBadge({ date, isStale }: DemandNoticeBadgeProps) {
  const { t } = useTranslation();

  if (!date) {
    return <Typography variant="body2">—</Typography>;
  }

  return (
    <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
      {isStale && (
        <WarningAmberIcon fontSize="small" color="error" aria-label={t('demandNotice.stale')} />
      )}
      <Typography
        variant="body2"
        sx={{
          color: isStale ? negativeDelta : 'text.primary',
          fontWeight: isStale ? 600 : 400,
        }}
      >
        {formatDate(date)}
      </Typography>
    </Stack>
  );
}
