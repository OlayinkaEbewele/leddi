import type { ColorMode } from '@/theme/tokens';
import { tokenVars } from '@/theme/cssVars';
import { dm } from '@/theme/darkModeTokens';
import { borderSubtle, cardShadow, surface } from '@/theme/theme';

export interface DashboardBucketTone {
  bg: string;
  label: string;
  count: string;
  stripe: string;
  dot: string;
  border: string;
}

const LIGHT_BUCKET_TONES: Record<string, DashboardBucketTone> = {
  critical: {
    bg: '#FCEBEB',
    label: '#791F1F',
    count: '#501313',
    stripe: '#791F1F',
    dot: '#B83A3A',
    border: '#F0C4C4',
  },
  warning: {
    bg: '#FAEEDA',
    label: '#633806',
    count: '#412402',
    stripe: '#633806',
    dot: '#C47B24',
    border: '#F0D4A8',
  },
  ptp: {
    bg: '#FEF9E7',
    label: '#73510D',
    count: '#4A3508',
    stripe: '#73510D',
    dot: '#C47B24',
    border: '#F0E4B8',
  },
  neutral: {
    bg: '#F1EFE8',
    label: '#5F5E5A',
    count: '#2C2C2A',
    stripe: '#5F5E5A',
    dot: '#5F5E5A',
    border: '#E8ECF0',
  },
  info: {
    bg: '#E6F1FB',
    label: '#185FA5',
    count: '#042C53',
    stripe: '#185FA5',
    dot: '#185FA5',
    border: '#C5D9E8',
  },
  infoDark: {
    bg: '#DCE8F8',
    label: '#0D4A8A',
    count: '#042C53',
    stripe: '#0D4A8A',
    dot: '#0D4A8A',
    border: '#C5D9E8',
  },
};

const DARK_BUCKET_TONES: Record<string, DashboardBucketTone> = {
  critical: {
    bg: '#2D0A0A',
    label: '#F87171',
    count: '#F87171',
    stripe: '#791F1F',
    dot: '#B83A3A',
    border: '#7F1D1D',
  },
  warning: {
    bg: '#2D1A00',
    label: '#FBB740',
    count: '#FBB740',
    stripe: '#633806',
    dot: '#C47B24',
    border: '#78350F',
  },
  ptp: {
    bg: '#2D1A00',
    label: '#FBB740',
    count: '#FBB740',
    stripe: '#73510D',
    dot: '#C47B24',
    border: '#78350F',
  },
  neutral: {
    bg: '#1A1F2B',
    label: '#94A3B8',
    count: '#94A3B8',
    stripe: '#5F5E5A',
    dot: '#5F5E5A',
    border: '#334155',
  },
  info: {
    bg: '#0D1B3E',
    label: '#60A5FA',
    count: '#60A5FA',
    stripe: '#185FA5',
    dot: '#185FA5',
    border: '#1E3A6E',
  },
  infoDark: {
    bg: '#0D1B3E',
    label: '#60A5FA',
    count: '#60A5FA',
    stripe: '#0D4A8A',
    dot: '#0D4A8A',
    border: '#1E3A6E',
  },
};

/** @deprecated Use getDashboardBucketTones(mode) */
export const DASHBOARD_BUCKET_TONES = LIGHT_BUCKET_TONES;

export function getDashboardBucketTones(mode: ColorMode) {
  return mode === 'dark' ? DARK_BUCKET_TONES : LIGHT_BUCKET_TONES;
}

export function getSummaryCardSx(mode: ColorMode) {
  return {
    bgcolor: surface,
    border: `1px solid ${borderSubtle}`,
    borderRadius: '10px',
    boxShadow: mode === 'dark' ? 'none' : cardShadow,
    p: 2.5,
    minHeight: 120,
  } as const;
}

/** @deprecated Use getSummaryCardSx(mode) */
export const SUMMARY_CARD_SX = getSummaryCardSx('light');

export const SUMMARY_GRID_SX = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr 1fr', lg: 'repeat(4, 1fr)' },
  gap: 2,
} as const;

export const BUCKET_GRID_SX = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
  gap: 2,
} as const;

export function getDashboardActionButtonSx(_mode?: ColorMode) {
  return {
    bgcolor: tokenVars.accent,
    color: '#fff',
    textTransform: 'none' as const,
    fontWeight: 600,
    fontSize: '0.8125rem',
    boxShadow: 'none',
    px: 2,
    py: 0.75,
    borderRadius: '8px',
    '&:hover': {
      bgcolor: tokenVars.accentHover,
      boxShadow: 'none',
    },
  } as const;
}

/** @deprecated Use getDashboardActionButtonSx() */
export const DASHBOARD_ACTION_BUTTON_SX = getDashboardActionButtonSx();

export function getDashboardLinkSx(_mode?: ColorMode) {
  return {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: tokenVars.accent,
    textDecoration: 'none',
    '&:hover': { textDecoration: 'underline' },
  } as const;
}

/** @deprecated Use getDashboardLinkSx(mode) */
export const DASHBOARD_LINK_SX = getDashboardLinkSx('light');

export function getTrendColor(
  sentiment: 'positive' | 'negative' | 'neutral' | 'warning',
  mode: ColorMode,
): string {
  if (sentiment === 'positive') return mode === 'dark' ? dm.success : '#2F6F57';
  if (sentiment === 'negative') return mode === 'dark' ? dm.danger : '#B83A3A';
  return mode === 'dark' ? dm.warning : '#C47B24';
}

export type DashboardLayoutMode = 'filled' | 'stripe';
