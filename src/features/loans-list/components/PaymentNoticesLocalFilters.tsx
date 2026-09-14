import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { useTranslation } from 'react-i18next';
import {
  PAYMENT_NOTICE_POSTING_TYPES,
  PAYMENT_NOTICE_PRODUCTS,
  PAYMENT_NOTICE_SEARCH_BY_OPTIONS,
  type PaymentNoticesLocalFiltersState,
} from '../types/filters';

const FILTER_GRID_SX = {
  display: 'grid',
  gridTemplateColumns:
    'minmax(140px, 0.7fr) minmax(240px, 2fr) auto minmax(140px, 0.9fr) minmax(160px, 0.9fr)',
  gap: 1.5,
  alignItems: 'start',
  width: '100%',
} as const;

interface PaymentNoticesLocalFiltersProps {
  value: PaymentNoticesLocalFiltersState;
  onChange: (next: PaymentNoticesLocalFiltersState) => void;
  onSearch?: () => void;
}

export function PaymentNoticesLocalFilters({
  value,
  onChange,
  onSearch,
}: PaymentNoticesLocalFiltersProps) {
  const { t } = useTranslation();

  return (
    <Box sx={{ ...FILTER_GRID_SX, mb: 2 }}>
      <FormControl size="small" sx={{ width: '100%', minWidth: 0 }}>
        <InputLabel>{t('paymentNotices.filters.searchBy')}</InputLabel>
        <Select
          label={t('paymentNotices.filters.searchBy')}
          value={value.searchBy}
          onChange={(e) => {
            onChange({
              ...value,
              searchBy: e.target.value as PaymentNoticesLocalFiltersState['searchBy'],
            });
          }}
        >
          {PAYMENT_NOTICE_SEARCH_BY_OPTIONS.map((key) => (
            <MenuItem key={key} value={key}>
              {t(`paymentNotices.filters.searchBy.${key}`)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        size="small"
        label={t(`paymentNotices.filters.searchBy.${value.searchBy}`)}
        placeholder={t('loans.localFilters.searchPlaceholder')}
        value={value.searchTerm}
        onChange={(e) => {
          onChange({ ...value, searchTerm: e.target.value });
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSearch?.();
        }}
        sx={{ width: '100%', minWidth: 0 }}
      />

      <Button
        variant="contained"
        size="small"
        startIcon={<SearchIcon />}
        onClick={onSearch}
        sx={{ py: 1, px: 2, alignSelf: 'stretch' }}
      >
        {t('loans.localFilters.search')}
      </Button>

      <FormControl size="small" sx={{ width: '100%', minWidth: 0 }}>
        <InputLabel>{t('paymentNotices.filters.product')}</InputLabel>
        <Select
          label={t('paymentNotices.filters.product')}
          value={value.productFilter}
          onChange={(e) => {
            onChange({ ...value, productFilter: e.target.value });
          }}
          renderValue={(selected) => (selected ? selected : t('filters.all'))}
        >
          <MenuItem value="">
            <ListItemText primary={t('filters.all')} />
          </MenuItem>
          {PAYMENT_NOTICE_PRODUCTS.map((product) => (
            <MenuItem key={product} value={product}>
              {product}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ width: '100%', minWidth: 0 }}>
        <InputLabel>{t('paymentNotices.filters.postingType')}</InputLabel>
        <Select
          label={t('paymentNotices.filters.postingType')}
          value={value.postingTypeFilter}
          onChange={(e) => {
            onChange({ ...value, postingTypeFilter: e.target.value });
          }}
          renderValue={(selected) => (selected ? selected : t('filters.all'))}
        >
          <MenuItem value="">
            <ListItemText primary={t('filters.all')} />
          </MenuItem>
          {PAYMENT_NOTICE_POSTING_TYPES.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
