import { createTheme, type PaletteMode } from '@mui/material/styles';
import {
  brandYellow,
  primaryDark,
  riskStage1,
  riskStage2,
  riskStage3,
} from './brand';
import { dm } from './darkModeTokens';
import type { DesignTokens } from './tokens';

export function createAppTheme(mode: PaletteMode, tokens: DesignTokens) {
  const isDark = mode === 'dark';

  return createTheme({
    tokens,
    dm: isDark ? dm : undefined,
    palette: {
      mode,
      primary: {
        main: tokens.accent,
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: tokens.accent,
        contrastText: '#FFFFFF',
      },
      accent: {
        main: brandYellow,
        contrastText: primaryDark,
      },
      risk: {
        stage1: isDark ? tokens.success : riskStage1,
        stage2: isDark ? tokens.warning : riskStage2,
        stage3: isDark ? tokens.danger : riskStage3,
      },
      success: {
        main: tokens.success,
        contrastText: '#FFFFFF',
      },
      warning: {
        main: tokens.warning,
        contrastText: '#FFFFFF',
      },
      error: {
        main: tokens.danger,
        contrastText: '#FFFFFF',
      },
      background: {
        default: tokens.pageBackground,
        paper: tokens.surface,
      },
      text: {
        primary: tokens.textPrimary,
        secondary: tokens.textSecondary,
      },
      divider: tokens.borderSubtle,
    },
    typography: {
      fontFamily:
        '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      fontSize: 13,
      h5: {
        fontSize: '1.25rem',
        fontWeight: 600,
        color: tokens.textPrimary,
        letterSpacing: '-0.01em',
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 600,
        color: tokens.textPrimary,
      },
      subtitle1: {
        fontSize: '0.875rem',
        fontWeight: 600,
        color: tokens.textPrimary,
      },
      body2: {
        fontSize: '0.8125rem',
        color: tokens.textPrimary,
      },
      caption: {
        fontSize: '0.75rem',
        color: tokens.textSecondary,
      },
      microLabel: {
        fontSize: '0.6875rem',
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: tokens.textMuted,
        lineHeight: 1.4,
      },
    },
    shape: {
      borderRadius: 14,
    },
    shadows: [
      'none',
      tokens.cardShadow === 'none' ? 'none' : tokens.cardShadow,
      tokens.cardShadow === 'none' ? 'none' : tokens.cardShadow,
      tokens.cardShadow === 'none' ? 'none' : tokens.cardShadow,
      tokens.cardShadow === 'none' ? 'none' : tokens.cardShadow,
      tokens.cardShadow === 'none' ? 'none' : tokens.cardShadow,
      tokens.cardShadow === 'none' ? 'none' : tokens.cardShadow,
      tokens.cardShadow === 'none' ? 'none' : tokens.cardShadow,
      tokens.cardShadow === 'none' ? 'none' : tokens.cardShadow,
      tokens.cardShadow === 'none' ? 'none' : tokens.cardShadow,
      tokens.cardShadow === 'none' ? 'none' : tokens.cardShadow,
      tokens.cardShadow === 'none' ? 'none' : tokens.cardShadow,
      tokens.cardShadow === 'none' ? 'none' : tokens.cardShadow,
      tokens.cardShadow === 'none' ? 'none' : tokens.cardShadow,
      tokens.cardShadow === 'none' ? 'none' : tokens.cardShadow,
      tokens.cardShadow === 'none' ? 'none' : tokens.cardShadow,
      tokens.cardShadow === 'none' ? 'none' : tokens.cardShadow,
      tokens.cardShadow === 'none' ? 'none' : tokens.cardShadow,
      tokens.cardShadow === 'none' ? 'none' : tokens.cardShadow,
      tokens.cardShadow === 'none' ? 'none' : tokens.cardShadow,
      tokens.cardShadow === 'none' ? 'none' : tokens.cardShadow,
      tokens.cardShadow === 'none' ? 'none' : tokens.cardShadow,
      tokens.cardShadow === 'none' ? 'none' : tokens.cardShadow,
      tokens.cardShadow === 'none' ? 'none' : tokens.cardShadow,
      tokens.cardShadow === 'none' ? 'none' : tokens.cardShadow,
    ],
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: tokens.pageBackground,
            color: tokens.textPrimary,
          },
        },
      },
      MuiButton: {
        defaultProps: {
          size: 'small',
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            borderRadius: 10,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.8125rem',
          },
          contained: {
            backgroundColor: tokens.accent,
            color: '#FFFFFF',
            '&:hover': {
              backgroundColor: tokens.accentHover,
            },
          },
          containedPrimary: {
            backgroundColor: tokens.accent,
            color: '#FFFFFF',
            '&:hover': {
              backgroundColor: tokens.accentHover,
            },
          },
          outlined: {
            borderColor: tokens.borderSubtle,
            color: isDark ? tokens.textSecondary : tokens.textPrimary,
            backgroundColor: isDark ? 'transparent' : tokens.surface,
            '&:hover': {
              borderColor: tokens.borderSubtle,
              backgroundColor: isDark ? tokens.surface2 : 'rgba(46, 49, 98, 0.03)',
            },
          },
        },
      },
      MuiPaper: {
        defaultProps: {
          elevation: isDark ? 0 : 1,
        },
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            borderRadius: 14,
            boxShadow: isDark ? 'none' : tokens.cardShadow,
            border: `1px solid ${tokens.borderSubtle}`,
            backgroundColor: tokens.surface,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 14,
            boxShadow: isDark ? 'none' : tokens.cardShadow,
            border: `1px solid ${tokens.borderSubtle}`,
            backgroundColor: tokens.surface,
          },
        },
      },
      MuiChip: {
        defaultProps: {
          size: 'small',
        },
        styleOverrides: {
          root: {
            fontWeight: 600,
            fontSize: '0.6875rem',
            letterSpacing: '0.02em',
            borderRadius: 8,
            height: 24,
          },
          sizeSmall: {
            height: 22,
            fontSize: '0.625rem',
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            backgroundColor: tokens.surface0,
            color: isDark ? tokens.textSecondary : tokens.textMuted,
            fontSize: '0.6875rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          size: 'small',
        },
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 10,
              backgroundColor: isDark ? tokens.surface0 : tokens.surface,
              color: tokens.textPrimary,
              '& fieldset': {
                borderColor: tokens.borderSubtle,
              },
              '&:hover fieldset': {
                borderColor: isDark ? tokens.accent : tokens.textMuted,
              },
              '&.Mui-focused fieldset': {
                borderColor: isDark ? tokens.accent : tokens.textPrimary,
              },
            },
            '& .MuiInputLabel-root': {
              color: tokens.textSecondary,
            },
            '& .MuiOutlinedInput-input::placeholder': {
              color: tokens.textMuted,
              opacity: 1,
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? tokens.surface0 : tokens.surface,
            '& fieldset': {
              borderColor: tokens.borderSubtle,
            },
            '&:hover fieldset': {
              borderColor: isDark ? tokens.accent : tokens.textMuted,
            },
          },
        },
      },
      MuiToggleButtonGroup: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? tokens.surface2 : '#EEF1F4',
            borderRadius: 8,
            padding: 2,
          },
        },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: {
            border: 'none',
            borderRadius: '6px !important',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: tokens.textSecondary,
            textTransform: 'none',
            padding: '4px 10px',
            '&.Mui-selected': {
              backgroundColor: tokens.accent,
              color: isDark ? tokens.textPrimary : '#FFFFFF',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: tokens.accentHover,
              },
            },
            '&:not(.Mui-selected)': {
              backgroundColor: isDark ? tokens.surface2 : 'transparent',
            },
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.8125rem',
            minHeight: 44,
            color: tokens.textSecondary,
            borderRadius: '8px 8px 0 0',
            '&.Mui-selected': {
              color: isDark ? tokens.textPrimary : '#FFFFFF',
              bgcolor: isDark ? 'transparent' : tokens.accent,
            },
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: {
            display: 'none',
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundColor: tokens.surface,
            backgroundImage: 'none',
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            backgroundColor: tokens.surface,
            backgroundImage: 'none',
            border: `1px solid ${tokens.borderSubtle}`,
          },
        },
      },
    },
  });
}
