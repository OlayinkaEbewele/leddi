import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { OperationalStatus } from '@/api/types';
import { ValueTag } from '@/components/ValueTag';
import { formatDisplayDate } from '@/utils/formatDate';

interface OperationalStatusCellProps {
  operationalStatus: OperationalStatus;
}

export function OperationalStatusCell({ operationalStatus }: OperationalStatusCellProps) {
  return (
    <Box>
      <ValueTag value={operationalStatus.status} />
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
        {formatDisplayDate(operationalStatus.asOfDate)}
      </Typography>
    </Box>
  );
}
