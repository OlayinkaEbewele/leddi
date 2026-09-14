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
  pageBackground: '#F8FAFC',
  surface: '#FFFFFF',
  surface0: '#F1F5F9',
  surface2: '#E2E8F0',
  borderSubtle: '#E8ECF0',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#64748B',
  cardShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  accent: '#071F49',
  accentHover: '#101e69',
  danger: '#991B1B',
  success: '#166534',
  warning: '#92400E',
  chipTones: {
    neutral: { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' },
    riskStage1: { bg: '#DCFCE7', color: '#166534', border: '#BBF7D0' },
    riskStage2: { bg: '#FEF3C7', color: '#92400E', border: '#FDE68A' },
    riskStage3: { bg: '#FEE2E2', color: '#991B1B', border: '#FECACA' },
    positive: { bg: '#DCFCE7', color: '#166534', border: '#BBF7D0' },
    negative: { bg: '#FEE2E2', color: '#991B1B', border: '#FECACA' },
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
    riskStage1: { bg: dm.successBg, color: dm.success, border: dm.successBorder },
    riskStage2: { bg: dm.warningBg, color: dm.warning, border: dm.warningBorder },
    riskStage3: { bg: dm.dangerBg, color: dm.danger, border: dm.dangerBorder },
    positive: { bg: dm.successBg, color: dm.success, border: dm.successBorder },
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
