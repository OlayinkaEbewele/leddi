import type { ChipTone } from './chipTones';
import { dm } from './darkModeTokens';
import { createAppTheme } from './createAppTheme';
import { chipTones, getDesignTokens, type DesignTokens } from './tokens';

export * from './brand';
export * from './chipTones';
export { dm } from './darkModeTokens';
export { applyCssVars, tokenVars } from './cssVars';
export {
  chipTones,
  darkDesignTokens,
  getDesignTokens,
  lightDesignTokens,
  type ColorMode,
  type DesignTokens,
} from './tokens';
export {
  pageBackground,
  surface,
  surface0,
  surface2,
  borderSubtle,
  textPrimary,
  textSecondary,
  textMuted,
  cardShadow,
} from './tokens';
export { createAppTheme } from './createAppTheme';
export { ThemeModeProvider, useThemeMode, useThemeTokens } from './ThemeModeProvider';

declare module '@mui/material/styles' {
  interface Theme {
    tokens: DesignTokens;
    dm?: typeof dm;
  }
  interface ThemeOptions {
    tokens?: DesignTokens;
    dm?: typeof dm;
  }
  interface Palette {
    accent: Palette['primary'];
    risk: {
      stage1: string;
      stage2: string;
      stage3: string;
    };
  }
  interface PaletteOptions {
    accent?: PaletteOptions['primary'];
    risk?: {
      stage1?: string;
      stage2?: string;
      stage3?: string;
    };
  }
  interface TypographyVariants {
    microLabel: React.CSSProperties;
  }
  interface TypographyVariantsOptions {
    microLabel?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    microLabel: true;
  }
}

/** @deprecated Use ThemeModeProvider. */
export const theme = createAppTheme('light', getDesignTokens('light'));

export const isProduction = import.meta.env.VITE_APP_ENV === 'production';

export function getEnvironmentLabel(): string {
  const env = import.meta.env.VITE_APP_ENV || 'development';
  return env.charAt(0).toUpperCase() + env.slice(1);
}

/** Soft pill chip styles — CSS-var based, updates with theme mode. */
export function getChipSx(tone: ChipTone): Record<string, string | number> {
  const t = chipTones[tone];
  return {
    bgcolor: t.bg,
    color: t.color,
    border: `1px solid ${t.border}`,
    fontWeight: 600,
  };
}
