import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { LoanDetails } from '@/api/types';
import { textMuted, textPrimary, textSecondary } from '@/theme/theme';
import { formatDisplayDate } from '@/utils/formatDate';

interface PrimeActivitiesFeedProps {
  loan: LoanDetails;
}

export function PrimeActivitiesFeed({ loan }: PrimeActivitiesFeedProps) {
  const { t } = useTranslation();

  const entries = useMemo(() => {
    const fromNotes = loan.notes
      .filter((n) => n.appSource === 'PRIME')
      .map((note) => ({
        id: note.id,
        timestamp: note.createdAt,
        actorName: note.createdBy,
        description:
          note.type === 'STATUS_UPDATE'
            ? `Status update note added`
            : note.type === 'RECEIPT'
              ? `Receipt note added`
              : `Note added via ${note.channel}`,
      }));

    const fromPtps = loan.ptps.map((ptp) => ({
      id: ptp.id,
      timestamp: ptp.createdAt,
      actorName: ptp.capturedBy,
      description: `PTP captured — ${ptp.status}`,
    }));

    const fromPrimeHistory = (loan.loanHistory ?? [])
      .filter((e) => e.module === 'PRIME')
      .map((e) => ({
        id: e.id,
        timestamp: e.timestamp,
        actorName: e.actorName,
        description: e.description,
      }));

    return [...fromNotes, ...fromPtps, ...fromPrimeHistory].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
  }, [loan]);

  if (entries.length === 0) {
    return (
      <Typography variant="body2" sx={{ color: textMuted, textAlign: 'center', py: 4 }}>
        {t('loanDetails.activities.empty')}
      </Typography>
    );
  }

  return (
    <Stack spacing={1.5}>
      {entries.map((entry) => (
        <Box key={entry.id} sx={{ py: 0.5 }}>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: textPrimary, mb: 0.25 }}>
            {entry.description}
          </Typography>
          <Typography variant="caption" sx={{ color: textSecondary }}>
            {formatDisplayDate(entry.timestamp)} · {entry.actorName}
          </Typography>
        </Box>
      ))}
    </Stack>
  );
}
