import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#fecaca', // Soft red
      light: '#fee2e2', // Lighter red
      dark: '#fca5a5', // Darker red
      contrastText: '#1F2937', // Dark gray for text
    },
    secondary: {
      main: '#fee2ea', // Soft pink
      light: '#fef2f2', // Very light pink
      dark: '#fbcfe8', // Darker pink
      contrastText: '#1F2937',
    },
    background: {
      default: '#fef2f2', // Very light pink/white
      paper: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white
    },
    text: {
      primary: '#1F2937', // Dark gray
      secondary: '#4B5563', // Medium gray
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          boxShadow: '0 4px 30px rgba(254, 202, 202, 0.2)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 10px 25px rgba(254, 202, 202, 0.3)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.98) !important',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 30px rgba(254, 202, 202, 0.2)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.8)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 20px',
        },
        contained: {
          background: 'linear-gradient(45deg, #fecaca 0%, #fee2ea 100%)',
          color: '#1F2937',
          '&:hover': {
            background: 'linear-gradient(45deg, #fecaca 0%, #fbcfe8 100%)',
            boxShadow: '0 4px 15px rgba(254, 202, 202, 0.4)',
          },
        },
        outlined: {
          borderColor: '#fecaca',
          color: '#1F2937',
          '&:hover': {
            borderColor: '#fecaca',
            background: 'rgba(254, 202, 202, 0.1)',
          },
        },
      },
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h1: {
      fontWeight: 700,
      color: '#1F2937',
    },
    h2: {
      fontWeight: 600,
      color: '#1F2937',
    },
    h3: {
      fontWeight: 600,
      color: '#1F2937',
    },
    h4: {
      fontWeight: 600,
      color: '#1F2937',
    },
    h5: {
      fontWeight: 600,
      color: '#1F2937',
    },
    h6: {
      fontWeight: 600,
      color: '#1F2937',
    },
  },
});

// Glass card styles
theme.components.MuiCard.glass = {
  background: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  border: '1px solid rgba(255, 255, 255, 0.8)',
  boxShadow: '0 4px 30px rgba(254, 202, 202, 0.2)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 25px rgba(254, 202, 202, 0.3)',
  },
};

export default theme;