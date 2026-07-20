import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { dm } from '@/theme/darkModeTokens';
import { brandTealAccent, brandTealLight, chipTones, getEnvironmentLabel, isProduction } from '@/theme/theme';
import { useThemeMode } from '@/theme/ThemeModeProvider';

interface EnvironmentPillProps {
  variant?: 'default' | 'sidebar';
}

/** Calm green environment pill — matches production reference (patch v0.2 §2). */
export function EnvironmentPill({ variant = 'default' }: EnvironmentPillProps) {
  const { t } = useTranslation();
  const { mode } = useThemeMode();

  if (isProduction) return null;

  const env = getEnvironmentLabel();

  if (variant === 'sidebar') {
    const isDark = mode === 'dark';
    return (
      <Box
        data-testid="environment-banner"
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.75,
          px: 1.5,
          py: 0.5,
          borderRadius: '20px',
          bgcolor: isDark ? dm.stagingBg : brandTealLight,
          alignSelf: 'flex-start',
        }}
      >
        <Box
          sx={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            bgcolor: isDark ? dm.stagingText : brandTealAccent,
            flexShrink: 0,
          }}
        />
        <Typography
          sx={{
            fontSize: '0.6875rem',
            fontWeight: 600,
            color: isDark ? dm.stagingText : brandTealAccent,
          }}
        >
          {t('app.environmentPill', { env })}
        </Typography>
      </Box>
    );
  }

  const healthy = chipTones.riskStage1;

  return (
    <Box
      data-testid="environment-banner"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        mx: 2,
        my: 1,
        px: 1.25,
        py: 0.5,
        borderRadius: '20px',
        bgcolor: healthy.bg,
        color: healthy.color,
        border: `1px solid ${healthy.border}`,
        fontSize: '0.6875rem',
        fontWeight: 600,
        alignSelf: 'flex-start',
      }}
    >
      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: healthy.color, flexShrink: 0 }} />
      {t('app.environmentPill', { env })}
    </Box>
  );
}
