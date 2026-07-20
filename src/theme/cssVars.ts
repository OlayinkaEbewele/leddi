import type { ChipTone } from './chipTones';
import type { DesignTokens } from './tokens';

/** CSS custom property names for design tokens. */
export const cssVar = {
  pageBackground: '--leddi-page-bg',
  surface: '--leddi-surface',
  surface0: '--leddi-surface-0',
  surface2: '--leddi-surface-2',
  borderSubtle: '--leddi-border',
  textPrimary: '--leddi-text-primary',
  textSecondary: '--leddi-text-secondary',
  textMuted: '--leddi-text-muted',
  cardShadow: '--leddi-card-shadow',
  accent: '--leddi-accent',
  accentHover: '--leddi-accent-hover',
  danger: '--leddi-danger',
  success: '--leddi-success',
  warning: '--leddi-warning',
} as const;

function chipVar(tone: ChipTone, part: 'bg' | 'color' | 'border'): string {
  return `--leddi-chip-${tone}-${part}`;
}

/** Stable CSS `var(...)` references — safe to freeze in module-level sx objects. */
export const tokenVars = {
  pageBackground: `var(${cssVar.pageBackground})`,
  surface: `var(${cssVar.surface})`,
  surface0: `var(${cssVar.surface0})`,
  surface2: `var(${cssVar.surface2})`,
  borderSubtle: `var(${cssVar.borderSubtle})`,
  textPrimary: `var(${cssVar.textPrimary})`,
  textSecondary: `var(${cssVar.textSecondary})`,
  textMuted: `var(${cssVar.textMuted})`,
  cardShadow: `var(${cssVar.cardShadow})`,
  accent: `var(${cssVar.accent})`,
  accentHover: `var(${cssVar.accentHover})`,
  danger: `var(${cssVar.danger})`,
  success: `var(${cssVar.success})`,
  warning: `var(${cssVar.warning})`,
  chipTones: {
    neutral: {
      bg: `var(${chipVar('neutral', 'bg')})`,
      color: `var(${chipVar('neutral', 'color')})`,
      border: `var(${chipVar('neutral', 'border')})`,
    },
    riskStage1: {
      bg: `var(${chipVar('riskStage1', 'bg')})`,
      color: `var(${chipVar('riskStage1', 'color')})`,
      border: `var(${chipVar('riskStage1', 'border')})`,
    },
    riskStage2: {
      bg: `var(${chipVar('riskStage2', 'bg')})`,
      color: `var(${chipVar('riskStage2', 'color')})`,
      border: `var(${chipVar('riskStage2', 'border')})`,
    },
    riskStage3: {
      bg: `var(${chipVar('riskStage3', 'bg')})`,
      color: `var(${chipVar('riskStage3', 'color')})`,
      border: `var(${chipVar('riskStage3', 'border')})`,
    },
    positive: {
      bg: `var(${chipVar('positive', 'bg')})`,
      color: `var(${chipVar('positive', 'color')})`,
      border: `var(${chipVar('positive', 'border')})`,
    },
    negative: {
      bg: `var(${chipVar('negative', 'bg')})`,
      color: `var(${chipVar('negative', 'color')})`,
      border: `var(${chipVar('negative', 'border')})`,
    },
  },
} as const;

export function applyCssVars(
  el: HTMLElement,
  tokens: DesignTokens,
  extras?: { accent: string; accentHover: string; danger: string; success: string; warning: string },
): void {
  el.style.setProperty(cssVar.pageBackground, tokens.pageBackground);
  el.style.setProperty(cssVar.surface, tokens.surface);
  el.style.setProperty(cssVar.surface0, tokens.surface0);
  el.style.setProperty(cssVar.surface2, tokens.surface2);
  el.style.setProperty(cssVar.borderSubtle, tokens.borderSubtle);
  el.style.setProperty(cssVar.textPrimary, tokens.textPrimary);
  el.style.setProperty(cssVar.textSecondary, tokens.textSecondary);
  el.style.setProperty(cssVar.textMuted, tokens.textMuted);
  el.style.setProperty(cssVar.cardShadow, tokens.cardShadow);

  if (extras) {
    el.style.setProperty(cssVar.accent, extras.accent);
    el.style.setProperty(cssVar.accentHover, extras.accentHover);
    el.style.setProperty(cssVar.danger, extras.danger);
    el.style.setProperty(cssVar.success, extras.success);
    el.style.setProperty(cssVar.warning, extras.warning);
  }

  (Object.keys(tokens.chipTones) as ChipTone[]).forEach((tone) => {
    const t = tokens.chipTones[tone];
    el.style.setProperty(chipVar(tone, 'bg'), t.bg);
    el.style.setProperty(chipVar(tone, 'color'), t.color);
    el.style.setProperty(chipVar(tone, 'border'), t.border);
  });
}

export function applyDocumentThemeAttrs(mode: 'light' | 'dark'): void {
  const root = document.documentElement;
  root.setAttribute('data-theme', mode);
  root.style.colorScheme = mode;
  root.style.backgroundColor =
    mode === 'dark' ? 'var(--leddi-page-bg, #090B0F)' : 'var(--leddi-page-bg, #F8F9FA)';
}
