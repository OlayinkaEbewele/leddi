import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { isIfrsFilterActive } from '@/utils/ifrsFilter';
import {
  LOAN_SEARCH_BY_OPTIONS,
  type LoansLocalFiltersState,
} from '../types/filters';
import { IfrsStatusFilterModal } from './IfrsStatusFilterModal';

const FILTER_GRID_SX = {
  display: 'grid',
  gridTemplateColumns:
    'minmax(140px, 0.7fr) minmax(240px, 2fr) auto minmax(140px, 0.9fr) minmax(140px, 0.9fr) auto',
  gap: 1.5,
  alignItems: 'start',
  width: '100%',
} as const;

interface LoansLocalFiltersProps {
  value: LoansLocalFiltersState;
  onChange: (next: LoansLocalFiltersState) => void;
  onSearch?: () => void;
  onReload?: () => void;
  isReloading?: boolean;
}

export function LoansLocalFilters({
  value,
  onChange,
  onSearch,
  onReload,
  isReloading,
}: LoansLocalFiltersProps) {
  const { t } = useTranslation();
  const [ifrsModalOpen, setIfrsModalOpen] = useState(false);

  const ifrsButtonLabel = isIfrsFilterActive(value.ifrsFilter)
    ? t(`loans.ifrsFilter.activeLabel.${value.ifrsFilter.quickFilter}`)
    : t('loans.localFilters.ifrsStatus');

  return (
    <>
      <Box sx={{ ...FILTER_GRID_SX, mb: 2 }}>
        <FormControl size="small" sx={{ width: '100%', minWidth: 0 }}>
          <InputLabel>{t('loans.localFilters.searchBy')}</InputLabel>
          <Select
            label={t('loans.localFilters.searchBy')}
            value={value.searchBy}
            onChange={(e) => {
              onChange({ ...value, searchBy: e.target.value as LoansLocalFiltersState['searchBy'] });
            }}
          >
            {LOAN_SEARCH_BY_OPTIONS.map((key) => (
              <MenuItem key={key} value={key}>
                {t(`loans.localFilters.searchBy.${key}`)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          size="small"
          label={t(`loans.localFilters.searchBy.${value.searchBy}`)}
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
          <InputLabel>{t('loans.localFilters.demandNotice')}</InputLabel>
          <Select
            label={t('loans.localFilters.demandNotice')}
            value={value.demandNoticeFilter}
            onChange={(e) => {
              onChange({
                ...value,
                demandNoticeFilter: e.target.value as LoansLocalFiltersState['demandNoticeFilter'],
              });
            }}
            renderValue={(selected) => {
              if (!selected) return t('filters.all');
              return t(`loans.demandNoticeFilter.${selected}.label`);
            }}
          >
            <MenuItem value="">
              <ListItemText primary={t('filters.all')} />
            </MenuItem>
            <MenuItem value="valid">
              <ListItemText
                primary={t('loans.demandNoticeFilter.valid.label')}
                secondary={t('loans.demandNoticeFilter.valid.caption')}
              />
            </MenuItem>
            <MenuItem value="expired">
              <ListItemText
                primary={t('loans.demandNoticeFilter.expired.label')}
                secondary={t('loans.demandNoticeFilter.expired.caption')}
              />
            </MenuItem>
            <MenuItem value="without">
              <ListItemText
                primary={t('loans.demandNoticeFilter.without.label')}
                secondary={t('loans.demandNoticeFilter.without.caption')}
              />
            </MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          size="small"
          startIcon={<FilterListIcon />}
          onClick={() => {
            setIfrsModalOpen(true);
          }}
          sx={{ width: '100%', justifyContent: 'flex-start', py: 1, textTransform: 'none' }}
        >
          {ifrsButtonLabel}
        </Button>

        <Button
          variant="outlined"
          size="small"
          startIcon={<RefreshIcon />}
          onClick={onReload}
          disabled={isReloading}
          sx={{ py: 1, px: 2, alignSelf: 'stretch', whiteSpace: 'nowrap' }}
        >
          {t('loans.reload')}
        </Button>
      </Box>

      <IfrsStatusFilterModal
        open={ifrsModalOpen}
        value={value.ifrsFilter}
        onClose={() => {
          setIfrsModalOpen(false);
        }}
        onApply={(ifrsFilter) => {
          onChange({ ...value, ifrsFilter });
        }}
      />
    </>
  );
}
