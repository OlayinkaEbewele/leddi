import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { borderSubtle, cardRadius, cardShadow, surface } from '@/theme/theme';

interface DetailSectionProps {
  title: string;
  children: React.ReactNode;
  headerAction?: React.ReactNode;
  /** When true, renders only children (used inside tabbed info panel). */
  embedded?: boolean;
}

export function DetailSection({ title, children, headerAction, embedded }: DetailSectionProps) {
  if (embedded) {
    return <>{children}</>;
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        mb: 2,
        bgcolor: surface,
        border: `1px solid ${borderSubtle}`,
        borderRadius: `${cardRadius}px`,
        boxShadow: cardShadow,
      }}
    >
      <Stack
        direction="row"
        sx={{ justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}
      >
        <Typography variant="microLabel">{title}</Typography>
        {headerAction}
      </Stack>
      {children}
    </Paper>
  );
}
