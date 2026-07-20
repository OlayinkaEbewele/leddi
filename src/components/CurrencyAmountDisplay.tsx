import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import { formatAmountOnly } from '@/utils/formatCurrency';
import { textMuted, textPrimary } from '@/theme/theme';

interface CurrencyAmountDisplayProps {
  amount: number;
  currency: string;
  /** Renders a prominent minus before the currency code (for deficit amounts). */
  negative?: boolean;
  /** Optional secondary line below the amount (e.g. payment date). */
  secondary?: ReactNode;
}

/** NGN prefix (small/muted) + numeric amount (large/bold) on one line. */
export function CurrencyAmountDisplay({
  amount,
  currency,
  negative = false,
  secondary,
}: CurrencyAmountDisplayProps) {
  return (
    <Box>
      <Typography
        component="div"
        sx={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: 0.5, lineHeight: 1.2 }}
      >
        {negative && (
          <Box component="span" sx={{ fontSize: '1.125rem', fontWeight: 700, color: textPrimary, mr: 0.25 }}>
            −
          </Box>
        )}
        <Box component="span" sx={{ fontSize: '0.75rem', fontWeight: 500, color: textMuted }}>
          {currency}
        </Box>
        <Box component="span" sx={{ fontSize: '1.125rem', fontWeight: 700, color: textPrimary }}>
          {formatAmountOnly(amount)}
        </Box>
      </Typography>
      {secondary && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
          {secondary}
        </Typography>
      )}
    </Box>
  );
}
