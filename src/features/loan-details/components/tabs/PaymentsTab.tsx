import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { LoanDetails } from '@/api/types';
import { formatCurrency } from '@/utils/formatCurrency';
import { accent } from '@/theme/theme';

interface PaymentsTabProps {
  loan: LoanDetails;
}

export function PaymentsTab({ loan }: PaymentsTabProps) {
  return (
    <Stack spacing={0} sx={{ pl: 1 }}>
      {loan.paymentTimeline.map((entry, idx) => (
        <Stack key={`${entry.month}-${entry.year}`} direction="row" spacing={2}>
          <Stack sx={{ alignItems: 'center', width: 20 }}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                bgcolor: accent,
                mt: 0.75,
              }}
            />
            {idx < loan.paymentTimeline.length - 1 && (
              <Box sx={{ width: 2, flex: 1, bgcolor: `${accent}44`, minHeight: 28 }} />
            )}
          </Stack>
          <Typography variant="body2" sx={{ fontWeight: 500, pb: 2 }}>
            {entry.month} {entry.year} - {formatCurrency(entry.amount, loan.currency)}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}
