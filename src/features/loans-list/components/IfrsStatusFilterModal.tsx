import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { IfrsFilterState, IfrsQuickFilter } from '@/utils/ifrsFilter';
import { accent, borderSubtle, primaryDark } from '@/theme/theme';

interface IfrsStatusFilterModalProps {
  open: boolean;
  value: IfrsFilterState;
  onClose: () => void;
  onApply: (next: IfrsFilterState) => void;
}

const QUICK_FILTER_OPTIONS: IfrsQuickFilter[] = [
  'all',
  'excludeCurrent',
  'currentOnly',
  'freeSelection',
];

const REGULAR_FILTER_KEYS = ['onePlus', 'twoPlus', 'threePlus', 'currentOnly'] as const;

type RegularFilterKey = (typeof REGULAR_FILTER_KEYS)[number];

export function IfrsStatusFilterModal({
  open,
  value,
  onClose,
  onApply,
}: IfrsStatusFilterModalProps) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<IfrsFilterState>(value);

  useEffect(() => {
    if (open) {
      setDraft(value);
    }
  }, [open, value]);

  const freeSelection = draft.quickFilter === 'freeSelection';

  const setQuickFilter = (quickFilter: IfrsQuickFilter) => {
    setDraft((prev) => ({ ...prev, quickFilter }));
  };

  const toggleRegular = (key: RegularFilterKey) => {
    setDraft((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: 2, overflow: 'hidden' },
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2.5,
          pt: 2,
          pb: 1,
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: primaryDark }}>
          {t('loans.ifrsFilter.modalTitle')}
        </Typography>
        <IconButton
          size="small"
          onClick={onClose}
          aria-label={t('common.close')}
          sx={{
            border: `1px solid ${borderSubtle}`,
            borderRadius: 1,
            color: primaryDark,
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ px: 2.5, pb: 2.5 }}>
        <Box
          sx={{
            border: `1px solid ${borderSubtle}`,
            borderRadius: 2,
            p: 2,
            bgcolor: 'background.paper',
          }}
        >
          <Typography variant="microLabel" sx={{ display: 'block', mb: 1 }}>
            {t('loans.ifrsFilter.quickFilters')}
          </Typography>
          <RadioGroup
            value={draft.quickFilter}
            onChange={(e) => {
              setQuickFilter(e.target.value as IfrsQuickFilter);
            }}
          >
            {QUICK_FILTER_OPTIONS.map((option) => (
              <FormControlLabel
                key={option}
                value={option}
                control={<Radio size="small" />}
                label={
                  <Typography variant="body2">{t(`loans.ifrsFilter.quick.${option}`)}</Typography>
                }
                sx={{ mx: 0, my: 0.25 }}
              />
            ))}
          </RadioGroup>

          <Typography variant="microLabel" sx={{ display: 'block', mt: 2, mb: 1 }}>
            {t('loans.ifrsFilter.regularFilters')}
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 0.5,
              opacity: freeSelection ? 1 : 0.45,
              pointerEvents: freeSelection ? 'auto' : 'none',
            }}
          >
            {REGULAR_FILTER_KEYS.map((key) => (
              <FormControlLabel
                key={key}
                control={
                  <Checkbox
                    size="small"
                    checked={draft[key]}
                    onChange={() => {
                      toggleRegular(key);
                    }}
                  />
                }
                label={
                  <Typography variant="body2">{t(`loans.ifrsFilter.regular.${key}`)}</Typography>
                }
                sx={{ mx: 0 }}
              />
            ))}
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={() => {
            onApply(draft);
            onClose();
          }}
          sx={{
            py: 1.25,
            bgcolor: accent,
            color: primaryDark,
            fontWeight: 700,
            textTransform: 'none',
            fontSize: '0.9375rem',
            '&:hover': { bgcolor: '#E5A419' },
          }}
        >
          {t('loans.ifrsFilter.apply')}
        </Button>
      </Box>
    </Dialog>
  );
}
