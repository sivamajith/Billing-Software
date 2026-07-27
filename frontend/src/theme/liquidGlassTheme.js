import { createTheme, responsiveFontSizes } from '@mui/material/styles';

export const createLiquidGlassTheme = (darkMode) => {
  const basePalette = {
    primary: {
      main: '#1b365d',
      light: '#4a7bce',
      dark: '#102743',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ffc344',
      light: '#ffe281',
      dark: '#b27e21',
      contrastText: '#1b365d',
    },
    info: {
      main: '#3ba4ff',
      contrastText: '#ffffff',
    },
    success: {
      main: '#25c58f',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#ffb300',
      contrastText: '#1b365d',
    },
    error: {
      main: '#e64a19',
      contrastText: '#ffffff',
    },
  };

  const theme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
      },
    },
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: basePalette.primary,
      secondary: basePalette.secondary,
      info: basePalette.info,
      success: basePalette.success,
      warning: basePalette.warning,
      error: basePalette.error,
      background: {
        default: darkMode ? '#091321' : '#f4f7fb',
        paper: darkMode ? 'rgba(13, 23, 44, 0.88)' : '#ffffff',
      },
      text: {
        primary: darkMode ? '#f5f9ff' : '#1f3255',
        secondary: darkMode ? '#a3b5d5' : '#5e718f',
      },
    },
    typography: {
      fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 700,
        lineHeight: 1.1,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 700,
      },
      h3: {
        fontSize: '1.6rem',
        fontWeight: 700,
      },
      h6: {
        fontWeight: 700,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.7,
      },
      body2: {
        fontSize: '0.95rem',
        lineHeight: 1.65,
      },
    },
    shape: {
      borderRadius: 14,
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: darkMode
              ? 'linear-gradient(135deg, rgba(10, 18, 32, 0.95), rgba(24, 42, 74, 0.98))'
              : 'linear-gradient(135deg, #ffffff, #eef3fa)',
            borderBottom: darkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(30, 58, 110, 0.08)',
            boxShadow: darkMode ? '0 10px 30px rgba(0, 0, 0, 0.25)' : '0 10px 30px rgba(79, 95, 126, 0.08)',
            color: darkMode ? '#f5f9ff' : '#1b365d',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            background: darkMode ? 'rgba(10, 18, 36, 0.9)' : '#ffffff',
            border: darkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(30, 58, 110, 0.12)',
            boxShadow: darkMode ? '0 16px 40px rgba(5, 23, 56, 0.35)' : '0 14px 30px rgba(58, 83, 126, 0.08)',
            backdropFilter: 'blur(16px)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 700,
            borderRadius: 12,
            padding: '10px 26px',
            transition: 'all 0.25s ease',
          },
          containedPrimary: {
            background: 'linear-gradient(135deg, #1b365d 0%, #3b67a7 100%)',
            color: '#ffffff',
            boxShadow: '0 10px 24px rgba(27, 54, 93, 0.25)',
            '&:hover': {
              background: 'linear-gradient(135deg, #163154 0%, #2f5695 100%)',
            },
          },
          containedSecondary: {
            background: 'linear-gradient(135deg, #ffb300 0%, #ffcb58 100%)',
            color: '#1b365d',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 18,
            border: darkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(30,58,110,0.08)',
            boxShadow: darkMode ? '0 18px 45px rgba(5, 23, 56, 0.24)' : '0 16px 30px rgba(97, 116, 151, 0.1)',
            transition: 'all 0.35s ease',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              background: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(245,247,252,0.9)',
              borderRadius: 14,
              '& fieldset': {
                borderColor: darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(30,58,110,0.15)',
              },
              '&:hover fieldset': {
                borderColor: '#3ba4ff',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#3ba4ff',
                boxShadow: '0 0 0 3px rgba(59, 164, 255, 0.12)',
              },
            },
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            background: darkMode ? '#081125' : '#f8fbff',
            borderRight: darkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(30,58,110,0.1)',
          },
        },
      },
    },
  });

  return responsiveFontSizes(theme);
};
