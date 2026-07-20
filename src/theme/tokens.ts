import type { ChipTone } from './chipTones';
import { dm } from './darkModeTokens';
import { tokenVars } from './cssVars';

export type ColorMode = 'light' | 'dark';

export interface ChipToneColors {
  bg: string;
  color: string;
  border: string;
}

export interface DesignTokens {
  pageBackground: string;
  surface: string;
  surface0: string;
  surface2: string;
  borderSubtle: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  cardShadow: string;
  accent: string;
  accentHover: string;
  danger: string;
  success: string;
  warning: string;
  chipTones: Record<ChipTone, ChipToneColors>;
}

export const lightDesignTokens: DesignTokens = {
  pageBackground: '#F8F9FA',
  surface: '#FFFFFF',
  surface0: '#F4F6F8',
  surface2: '#EEF1F4',
  borderSubtle: '#E8ECF0',
  textPrimary: '#2E3162',
  textSecondary: '#5C6B73',
  textMuted: '#8B9AAB',
  cardShadow: '0 1px 3px rgba(46, 49, 98, 0.06), 0 4px 16px rgba(46, 49, 98, 0.05)',
  accent: '#071F49',
  accentHover: '#101e69',
  danger: '#B83A3A',
  success: '#4A7C59',
  warning: '#C47B24',
  chipTones: {
    neutral: { bg: '#F0F3F5', color: '#5C6B73', border: '#E8ECF0' },
    riskStage1: { bg: '#E8F0EA', color: '#4A7C59', border: '#C5D9CB' },
    riskStage2: { bg: '#FDF4E8', color: '#C47B24', border: '#F0D4A8' },
    riskStage3: { bg: '#FCEAEA', color: '#B83A3A', border: '#F0C4C4' },
    positive: { bg: '#E6FBF4', color: '#0A7B56', border: '#B8EDDA' },
    negative: { bg: '#FAECEC', color: '#C97B7B', border: '#F0D0D0' },
  },
};

export const darkDesignTokens: DesignTokens = {
  pageBackground: dm.canvas,
  surface: dm.surface1,
  surface0: dm.surface0,
  surface2: dm.surface2,
  borderSubtle: dm.border,
  textPrimary: dm.textPrimary,
  textSecondary: dm.textSecondary,
  textMuted: dm.textMuted,
  cardShadow: 'none',
  accent: dm.accent,
  accentHover: dm.accentHover,
  danger: dm.danger,
  success: dm.success,
  warning: dm.warning,
  chipTones: {
    neutral: { bg: dm.neutralBg, color: dm.neutralText, border: dm.neutralBorder },
    riskStage1: { bg: dm.successBg, color: dm.success, border: '#14532D' },
    riskStage2: { bg: dm.warningBg, color: dm.warning, border: dm.warningBorder },
    riskStage3: { bg: dm.dangerBg, color: dm.danger, border: dm.dangerBorder },
    positive: { bg: dm.successBg, color: dm.success, border: '#14532D' },
    negative: { bg: dm.dangerBg, color: dm.danger, border: dm.dangerBorder },
  },
};

export function getDesignTokens(mode: ColorMode): DesignTokens {
  return mode === 'dark' ? darkDesignTokens : lightDesignTokens;
}

/**
 * Public token references for sx props.
 * These are CSS variables — they update live when ThemeModeProvider applies a mode.
 * Do not mutate; do not call applyDesignTokens.
 */
export const pageBackground = tokenVars.pageBackground;
export const surface = tokenVars.surface;
export const surface0 = tokenVars.surface0;
export const surface2 = tokenVars.surface2;
export const borderSubtle = tokenVars.borderSubtle;
export const textPrimary = tokenVars.textPrimary;
export const textSecondary = tokenVars.textSecondary;
export const textMuted = tokenVars.textMuted;
export const cardShadow = tokenVars.cardShadow;
export const chipTones = tokenVars.chipTones;
