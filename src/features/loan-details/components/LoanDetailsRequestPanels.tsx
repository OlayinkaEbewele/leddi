import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import type { LoanDetails } from '@/api/types';
import { DisposalStatusPanel } from './panels/DisposalStatusPanel';
import { RecoveryStatusPanel } from './panels/RecoveryStatusPanel';

interface LoanDetailsRequestPanelsProps {
  loan: LoanDetails;
}

/** Recovery and disposal status cards — shown below customer detail tabs when applicable. */
export function LoanDetailsRequestPanels({ loan }: LoanDetailsRequestPanelsProps) {
  if (!loan.recovery && !loan.disposal) return null;

  return (
    <Box>
      <Stack spacing={1.5} direction={{ xs: 'column', md: 'row' }}>
        {loan.recovery && (
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <RecoveryStatusPanel recovery={loan.recovery} />
          </Box>
        )}
        {loan.disposal && (
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <DisposalStatusPanel disposal={loan.disposal} />
          </Box>
        )}
      </Stack>
    </Box>
  );
}
