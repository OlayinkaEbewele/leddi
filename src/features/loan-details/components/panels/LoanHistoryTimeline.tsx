import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import type { LoanHistoryEntry, LoanHistoryModule } from '@/api/types';
import { borderSubtle, textMuted, textPrimary, textSecondary } from '@/theme/theme';
import { formatDisplayDate } from '@/utils/formatDate';

const MODULE_STYLES: Record<
  LoanHistoryModule,
  { dot: string; badgeBg: string; badgeText: string; label: string }
> = {
  PRIME: { dot: '#071142', badgeBg: '#E6EBF8', badgeText: '#071142', label: 'Prime' },
  NEST: { dot: '#2D6A4F', badgeBg: '#E6F5ED', badgeText: '#1A7A45', label: 'Nest' },
  MIST: { dot: '#D97706', badgeBg: '#FEF3CD', badgeText: '#D97706', label: 'Mist' },
  PAPER: { dot: '#185FA5', badgeBg: '#E6F1FB', badgeText: '#185FA5', label: 'Paper' },
  X: { dot: '#888780', badgeBg: '#F1EFE8', badgeText: '#5F5E5A', label: 'X' },
};

interface LoanHistoryTimelineProps {
  entries: LoanHistoryEntry[];
}

export function LoanHistoryTimeline({ entries }: LoanHistoryTimelineProps) {
  const { t } = useTranslation();

  if (entries.length === 0) {
    return (
      <Typography variant="body2" sx={{ color: textMuted, textAlign: 'center', py: 4 }}>
        {t('loanDetails.history.empty')}
      </Typography>
    );
  }

  return (
    <Stack spacing={0}>
      {entries.map((entry, index) => {
        const style = MODULE_STYLES[entry.module];
        const isLast = index === entries.length - 1;

        return (
          <Box key={entry.id} sx={{ display: 'flex', gap: 1.25, position: 'relative' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 14, flexShrink: 0 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: style.dot,
                  mt: 0.5,
                  flexShrink: 0,
                }}
              />
              {!isLast && (
                <Box
                  sx={{
                    flex: 1,
                    width: '1px',
                    bgcolor: borderSubtle,
                    minHeight: 24,
                    my: 0.25,
                  }}
                />
              )}
            </Box>
            <Box sx={{ pb: isLast ? 0 : 2, minWidth: 0, flex: 1 }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: textPrimary, mb: 0.25 }}>
                {entry.description}
              </Typography>
              <Typography variant="caption" sx={{ color: textSecondary, display: 'block', mb: 0.5 }}>
                {formatDisplayDate(entry.timestamp)} · {entry.actorName}
              </Typography>
              <Chip
                label={style.label}
                size="small"
                sx={{
                  height: 18,
                  fontSize: '0.625rem',
                  fontWeight: 700,
                  bgcolor: style.badgeBg,
                  color: style.badgeText,
                }}
              />
            </Box>
          </Box>
        );
      })}
    </Stack>
  );
}
