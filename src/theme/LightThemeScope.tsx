import Box from '@mui/material/Box';
import { ThemeProvider } from '@mui/material/styles';
import { useLayoutEffect, useMemo, useRef, type ReactNode } from 'react';
import { createAppTheme } from './createAppTheme';
import { applyCssVars } from './cssVars';
import { lightDesignTokens } from './tokens';

/**
 * Forces light MUI theme + light CSS vars for a subtree (login),
 * without changing the user's global theme preference.
 */
export function LightThemeScope({ children }: { children: ReactNode }) {
  const theme = useMemo(() => createAppTheme('light', lightDesignTokens), []);
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    applyCssVars(el, lightDesignTokens, {
      accent: lightDesignTokens.accent,
      accentHover: lightDesignTokens.accentHover,
      danger: lightDesignTokens.danger,
      success: lightDesignTokens.success,
      warning: lightDesignTokens.warning,
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box ref={ref} sx={{ minHeight: '100vh' }}>
        {children}
      </Box>
    </ThemeProvider>
  );
}
