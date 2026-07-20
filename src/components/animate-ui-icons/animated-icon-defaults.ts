import type { CSSProperties } from 'react';

/** Default animated icon size used in buttons and toolbars. */
export const DEFAULT_ICON_SIZE = 18;

/** Default animated icon size for compact icon buttons. */
export const SMALL_ICON_SIZE = 16;

/** Shared hover animation props for animate-ui icons. */
export const hoverAnimate = { animateOnHover: true as const };

export function iconStyle(color?: string, size = DEFAULT_ICON_SIZE): CSSProperties {
  return {
    color,
    width: size,
    height: size,
    flexShrink: 0,
  };
}
