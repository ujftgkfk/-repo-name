import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00e599',
      light: '#33eaad',
      dark: '#00b377'
    },
    secondary: {
      main: '#7F3FF2',
      light: '#9965f4',
      dark: '#662cbf'
    },
    success: {
      main: '#00e599',
      light: '#33eaad',
      dark: '#00b377'
    },
    error: {
      main: '#FF4C5A',
      light: '#ff7078',
      dark: '#cc3d48'
    },
    warning: {
      main: '#FFA500',
      light: '#ffb733',
      dark: '#cc8400'
    },
    info: {
      main: '#3B82F6',
      light: '#629bf8',
      dark: '#2f68c5'
    },
    background: {
      default: '#0f121a',
      paper: '#1a1e2e'
    },
    text: {
      primary: '#ffffff',
      secondary: '#9ca3af'
    }
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12
        }
      }
    }
  }
});

export default theme;
