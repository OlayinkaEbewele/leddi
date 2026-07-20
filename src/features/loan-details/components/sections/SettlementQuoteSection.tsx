import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';
import type { LoanDetails } from '@/api/types';
import { CurrencyAmountDisplay } from '@/components/CurrencyAmountDisplay';
import { formatDateTime } from '@/utils/formatDate';
import { useLoanActions } from '../../hooks/useLoanActions';
import { DetailSection } from './DetailSection';
import { FieldGrid, FieldGridBelow, type FieldGridItem } from './FieldGrid';
import { dm } from '@/theme/darkModeTokens';
import { useThemeMode } from '@/theme/ThemeModeProvider';

interface SettlementQuoteSectionProps {
  loan: LoanDetails;
  embedded?: boolean;
}

export function SettlementQuoteSection({ loan, embedded }: SettlementQuoteSectionProps) {
  const { t } = useTranslation();
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';
  const { generateSettlementQuote } = useLoanActions(loan.acquireId);
  const quote = loan.settlementQuote;

  const headerAction = !embedded ? (
    <Button
      variant="contained"
      size="small"
      startIcon={<RequestQuoteOutlinedIcon />}
      onClick={() => void generateSettlementQuote.mutateAsync()}
      disabled={generateSettlementQuote.isPending}
    >
      {t('loanDetails.settlement.generate')}
    </Button>
  ) : undefined;

  const fields: FieldGridItem[] = quote
    ? [
        {
          label: t('loanDetails.settlement.amount'),
          value:
            quote.amount != null ? (
              <CurrencyAmountDisplay amount={quote.amount} currency={loan.currency} />
            ) : (
              '—'
            ),
        },
        {
          label: t('loanDetails.settlement.generatedAt'),
          value: quote.generatedAt ? formatDateTime(quote.generatedAt) : '—',
        },
        { label: t('loanDetails.settlement.status'), value: quote.status ?? '—' },
      ]
    : [];

  return (
    <DetailSection title={t('loanDetails.sections.settlement')} headerAction={headerAction} embedded={embedded}>
      {quote ? (
        <FieldGrid fields={fields} />
      ) : (
        <Alert
          severity="info"
          icon={<RequestQuoteOutlinedIcon sx={{ color: isDark ? dm.accent : undefined }} />}
          sx={
            isDark
              ? {
                  bgcolor: dm.infoBg,
                  border: `1px solid ${dm.infoBorder}`,
                  color: dm.info,
                  '& .MuiAlert-icon': { color: dm.accent },
                }
              : undefined
          }
        >
          {t('loanDetails.settlement.notFound')}
        </Alert>
      )}
      {generateSettlementQuote.isSuccess && (
        <FieldGridBelow>
          <Alert severity="success">{t('settlement.success')}</Alert>
        </FieldGridBelow>
      )}
    </DetailSection>
  );
}
