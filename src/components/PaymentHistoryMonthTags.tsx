import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { PaymentHistoryMonth } from '@/api/types';
import { riskStage1, riskStage3 } from '@/theme/theme';

interface PaymentHistoryMonthTagsProps {
  months: PaymentHistoryMonth[];
  caption?: string;
}

/** Six-month payment history pills — green when on-track, red when defaulted. */
export function PaymentHistoryMonthTags({ months, caption }: PaymentHistoryMonthTagsProps) {
  return (
    <Stack spacing={0.75}>
      <Stack direction="row" spacing={0.75} sx={{ flexWrap: 'wrap' }} useFlexGap>
        {months.map((m) => (
          <Chip
            key={m.monthLabel}
            label={m.monthLabel}
            size="small"
            sx={{
              bgcolor: m.defaulted ? riskStage3 : riskStage1,
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '0.6875rem',
              height: 22,
              borderRadius: '999px',
              '& .MuiChip-label': { px: 1.25 },
            }}
          />
        ))}
      </Stack>
      {caption && (
        <Typography
          variant="caption"
          sx={{ color: 'text.secondary', fontStyle: 'italic', display: 'block' }}
        >
          {caption}
        </Typography>
      )}
    </Stack>
  );
}
