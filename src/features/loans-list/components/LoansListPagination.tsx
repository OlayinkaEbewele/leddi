import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { tokenVars } from '@/theme/cssVars';
import {
  borderSubtle,
  pageBackground,
  surface,
  textMuted,
  textSecondary,
} from '@/theme/theme';

interface LoansListPaginationProps {
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

export function LoansListPagination({
  page,
  pageSize,
  totalCount,
  onPageChange,
}: LoansListPaginationProps) {
  const { t } = useTranslation();
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const start = totalCount === 0 ? 0 : page * pageSize + 1;
  const end = Math.min((page + 1) * pageSize, totalCount);

  const pageNumbers = getVisiblePages(page, totalPages);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        mt: 2,
        px: 2,
        py: 1.5,
        bgcolor: pageBackground,
        border: `1px solid ${borderSubtle}`,
        borderRadius: '10px',
        flexWrap: 'wrap',
      }}
    >
      <Typography variant="caption" sx={{ color: textSecondary, fontSize: '0.8125rem' }}>
        {t('loans.pagination.showing', { start, end, total: totalCount.toLocaleString() })}
      </Typography>

      <Stack direction="row" spacing={0.75} alignItems="center">
        <PaginationButton
          disabled={page === 0}
          onClick={() => {
            onPageChange(page - 1);
          }}
        >
          {t('loans.pagination.prev')}
        </PaginationButton>

        {pageNumbers.map((pageNum) => (
          <PaginationButton
            key={pageNum}
            active={pageNum === page}
            onClick={() => {
              onPageChange(pageNum);
            }}
          >
            {pageNum + 1}
          </PaginationButton>
        ))}

        <PaginationButton
          disabled={page >= totalPages - 1}
          onClick={() => {
            onPageChange(page + 1);
          }}
        >
          {t('loans.pagination.next')}
        </PaginationButton>
      </Stack>
    </Box>
  );
}

function PaginationButton({
  children,
  active,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <Button
      size="small"
      disabled={disabled}
      onClick={onClick}
      sx={{
        minWidth: 36,
        px: 1.25,
        py: 0.5,
        fontSize: '0.8125rem',
        fontWeight: 600,
        textTransform: 'none',
        borderRadius: '8px',
        border: `1px solid ${active ? tokenVars.accent : borderSubtle}`,
        bgcolor: active ? tokenVars.accent : surface,
        color: active ? '#fff' : textMuted,
        boxShadow: 'none',
        '&:hover': {
          bgcolor: active ? tokenVars.accentHover : surface,
          borderColor: active ? tokenVars.accent : borderSubtle,
        },
        '&.Mui-disabled': {
          bgcolor: surface,
          color: textMuted,
          opacity: 0.5,
        },
      }}
    >
      {children}
    </Button>
  );
}

function getVisiblePages(current: number, total: number): number[] {
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i);
  }
  const pages = new Set<number>([0, total - 1, current]);
  if (current > 0) pages.add(current - 1);
  if (current < total - 1) pages.add(current + 1);
  return Array.from(pages).sort((a, b) => a - b);
}
