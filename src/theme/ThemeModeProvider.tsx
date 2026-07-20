import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { createAppTheme } from './createAppTheme';
import { applyCssVars, applyDocumentThemeAttrs } from './cssVars';
import {
  type ColorMode,
  type DesignTokens,
  getDesignTokens,
} from './tokens';

const STORAGE_KEY = 'leddi-prime-theme-mode';
const LEGACY_STORAGE_KEY = 'leddi-color-mode';

interface ThemeModeContextValue {
  mode: ColorMode;
  tokens: DesignTokens;
  isDark: boolean;
  setMode: (mode: ColorMode) => void;
  toggleMode: () => void;
  toggleTheme: () => void;
}

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

function readStoredMode(): ColorMode {
  try {
    let stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacy === 'dark' || legacy === 'light') {
        stored = legacy;
        localStorage.setItem(STORAGE_KEY, legacy);
      }
    }
    if (stored === 'dark' || stored === 'light') return stored;
  } catch {
    // ignore
  }
  return 'light';
}

function persistMode(mode: ColorMode): void {
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // ignore
  }
}

function applyModeToDocument(mode: ColorMode): DesignTokens {
  const tokens = getDesignTokens(mode);
  applyCssVars(document.documentElement, tokens, {
    accent: tokens.accent,
    accentHover: tokens.accentHover,
    danger: tokens.danger,
    success: tokens.success,
    warning: tokens.warning,
  });
  applyDocumentThemeAttrs(mode);
  return tokens;
}

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ColorMode>(() => {
    const initial = readStoredMode();
    applyModeToDocument(initial);
    return initial;
  });

  // Keep document in sync if mode changes (also covers StrictMode remounts).
  useEffect(() => {
    applyModeToDocument(mode);
  }, [mode]);

  const setMode = useCallback((next: ColorMode) => {
    persistMode(next);
    setModeState(next);
  }, []);

  const toggleMode = useCallback(() => {
    setModeState((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      persistMode(next);
      return next;
    });
  }, []);

  const tokens = useMemo(() => getDesignTokens(mode), [mode]);
  const theme = useMemo(() => createAppTheme(mode, tokens), [mode, tokens]);

  const value = useMemo<ThemeModeContextValue>(
    () => ({
      mode,
      tokens,
      isDark: mode === 'dark',
      setMode,
      toggleMode,
      toggleTheme: toggleMode,
    }),
    [mode, tokens, setMode, toggleMode],
  );

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode(): ThemeModeContextValue {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) {
    throw new Error('useThemeMode must be used within ThemeModeProvider');
  }
  return ctx;
}

/** Active design tokens for the current color mode. */
export function useThemeTokens(): DesignTokens {
  return useThemeMode().tokens;
}
