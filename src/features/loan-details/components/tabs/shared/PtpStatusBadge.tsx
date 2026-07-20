import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { PromiseToPay } from '@/api/types';

const PTP_STATUS_TONES: Record<
  PromiseToPay['status'],
  { bg: string; color: string; label: string }
> = {
  PENDING: { bg: '#FAEEDA', color: '#633806', label: 'Pending' },
  KEPT: { bg: '#E6FBF4', color: '#0A7B56', label: 'Kept' },
  BROKEN: { bg: '#FCEAEA', color: '#B83A3A', label: 'Broken' },
};

interface PtpStatusBadgeProps {
  status: PromiseToPay['status'];
}

export function PtpStatusBadge({ status }: PtpStatusBadgeProps) {
  const tone = PTP_STATUS_TONES[status];

  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        px: 1,
        py: 0.25,
        borderRadius: '6px',
        bgcolor: tone.bg,
        color: tone.color,
        fontSize: '0.75rem',
        fontWeight: 600,
      }}
    >
      <Typography component="span" sx={{ fontSize: 'inherit', fontWeight: 'inherit' }}>
        {tone.label}
      </Typography>
    </Box>
  );
}
