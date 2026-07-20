import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import type { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { useTranslation } from 'react-i18next';
import type { GlobalFiltersState } from '../types/filters';

const COUNTRIES = ['', 'NG', 'GH', 'KE', 'UG'];
const CLASSIFICATIONS = [
  '',
  'NG RIDEHAIL_MIG',
  'KE DISC_MIG',
  'UG VEHFIN_MIG',
  'NG VEHFIN',
  'NG RETAIL',
];
const STRUCTURE_CODES = ['', 'NG-20', 'NG-12', 'NG-25', 'NG-07', 'KE-03', 'UG-01'];
const STATUSES = ['ACTIVE', 'MISSEDPAYMENT', 'DEFAULTED', 'DELINQUENT', 'IN_RECOVERY'];
const CATEGORIES = ['', 'Uncategorized', 'Normal', 'Commercial', 'Top-up'];

const FILTER_GRID_SX = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
  gap: 1.5,
  alignItems: 'start',
  width: '100%',
} as const;

interface GlobalFilterBarProps {
  value: GlobalFiltersState;
  onChange: (next: GlobalFiltersState) => void;
}

export function GlobalFilterBar({ value, onChange }: GlobalFilterBarProps) {
  const { t } = useTranslation();

  const handleStatusChange = (e: SelectChangeEvent<string[]>) => {
    const v = e.target.value;
    onChange({ ...value, statuses: typeof v === 'string' ? v.split(',') : v });
  };

  return (
    <Box
      sx={{
        ...FILTER_GRID_SX,
        mb: 2,
        p: 1.5,
        borderRadius: 2,
        bgcolor: 'background.paper',
        border: 1,
        borderColor: 'divider',
      }}
    >
      <FormControl size="small" sx={{ width: '100%', minWidth: 0 }}>
        <InputLabel>{t('filters.country')}</InputLabel>
        <Select
          label={t('filters.country')}
          value={value.country}
          onChange={(e) => {
            onChange({ ...value, country: e.target.value });
          }}
        >
          <MenuItem value="">{t('filters.allCountries')}</MenuItem>
          {COUNTRIES.filter(Boolean).map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ width: '100%', minWidth: 0 }}>
        <InputLabel>{t('filters.classification')}</InputLabel>
        <Select
          label={t('filters.classification')}
          value={value.classification}
          onChange={(e) => {
            onChange({ ...value, classification: e.target.value });
          }}
        >
          {CLASSIFICATIONS.map((c) => (
            <MenuItem key={c || 'all'} value={c}>
              {c || t('filters.all')}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ width: '100%', minWidth: 0 }}>
        <InputLabel>{t('filters.structureCode')}</InputLabel>
        <Select
          label={t('filters.structureCode')}
          value={value.structureCode}
          onChange={(e) => {
            onChange({ ...value, structureCode: e.target.value });
          }}
        >
          {STRUCTURE_CODES.map((c) => (
            <MenuItem key={c || 'all'} value={c}>
              {c || t('filters.all')}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ width: '100%', minWidth: 0 }}>
        <InputLabel>{t('filters.statuses')}</InputLabel>
        <Select
          multiple
          label={t('filters.statuses')}
          value={value.statuses}
          onChange={handleStatusChange}
          renderValue={(selected) => (selected.length ? selected.join(', ') : t('filters.all'))}
        >
          {STATUSES.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ width: '100%', minWidth: 0 }}>
        <InputLabel>{t('filters.loanCategory')}</InputLabel>
        <Select
          label={t('filters.loanCategory')}
          value={value.loanCategory}
          onChange={(e) => {
            onChange({ ...value, loanCategory: e.target.value });
          }}
        >
          {CATEGORIES.map((c) => (
            <MenuItem key={c || 'all'} value={c}>
              {c || t('filters.all')}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        size="small"
        type="date"
        label={t('filters.startDate')}
        value={value.dateFrom}
        onChange={(e) => {
          onChange({ ...value, dateFrom: e.target.value });
        }}
        slotProps={{ inputLabel: { shrink: true } }}
        sx={{ width: '100%', minWidth: 0 }}
      />
      <TextField
        size="small"
        type="date"
        label={t('filters.endDate')}
        value={value.dateTo}
        onChange={(e) => {
          onChange({ ...value, dateTo: e.target.value });
        }}
        slotProps={{ inputLabel: { shrink: true } }}
        sx={{ width: '100%', minWidth: 0 }}
      />
    </Box>
  );
}
