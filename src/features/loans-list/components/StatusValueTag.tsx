import Chip from '@mui/material/Chip';
import { getChipSx } from '@/theme/theme';
import { getStatusChipTone } from '../utils/statusTagTone';

interface StatusValueTagProps {
  value: string;
}

export function StatusValueTag({ value }: StatusValueTagProps) {
  const tone = getStatusChipTone(value);
  return (
    <Chip
      label={value}
      size="small"
      sx={{
        ...getChipSx(tone),
        fontWeight: 600,
        fontSize: '0.6875rem',
        height: 24,
        borderRadius: '6px',
      }}
    />
  );
}
