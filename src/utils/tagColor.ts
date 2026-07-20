import type { ColorMode } from '@/theme/tokens';

export interface TagColorStyle {
  bg: string;
  color: string;
  border: string;
}

/** Fixed palette — index chosen deterministically from the tag value string. */
const TAG_PALETTE_LIGHT: TagColorStyle[] = [
  { bg: '#E8F0EA', color: '#3D6B4F', border: '#C5D9CB' },
  { bg: '#EEF2FF', color: '#4A5E8A', border: '#D4DCF0' },
  { bg: '#FDF4E8', color: '#9A6410', border: '#F0D4A8' },
  { bg: '#F3E8FD', color: '#6B4C9A', border: '#D9C5F0' },
  { bg: '#FAECEC', color: '#9B4C4C', border: '#F0C4C4' },
  { bg: '#E6FBF4', color: '#0A7B56', border: '#B8EDDA' },
  { bg: '#FFF8E6', color: '#8A6B1A', border: '#F0E4B8' },
  { bg: '#E8F4FA', color: '#2E6B8A', border: '#C5D9E8' },
];

const TAG_PALETTE_DARK: TagColorStyle[] = [
  { bg: '#0D2818', color: '#4ADE80', border: '#14532D' },
  { bg: '#0D1B3E', color: '#60A5FA', border: '#1E3A6E' },
  { bg: '#2D1A00', color: '#FBB740', border: '#78350F' },
  { bg: '#1A0D28', color: '#C084FC', border: '#4C1D95' },
  { bg: '#2D0A0A', color: '#F87171', border: '#7F1D1D' },
  { bg: '#0D2818', color: '#4ADE80', border: '#14532D' },
  { bg: '#2D1A00', color: '#FBB740', border: '#78350F' },
  { bg: '#0D1B3E', color: '#60A5FA', border: '#1E3A6E' },
];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Maps an arbitrary string to a stable color from TAG_PALETTE.
 * Used for table tag columns and role chips.
 */
export function getTagColor(value: string, mode: ColorMode = 'light'): TagColorStyle {
  // TODO(confirm): patch v0.2 §7.3 — real coloring rule (fixed-map vs hash vs semantic) unconfirmed
  const palette = mode === 'dark' ? TAG_PALETTE_DARK : TAG_PALETTE_LIGHT;
  const index = hashString(value) % palette.length;
  return palette[index];
}
