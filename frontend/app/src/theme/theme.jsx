

// import { createTheme } from '@mui/material/styles';

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: '#4285F4', // Blue
//       light: '#6EA8FF', // Lighter blue
//       dark: '#3367D6', // Darker blue
//       contrastText: '#FFFFFF', // White text
//     },
//     secondary: {
//       main: '#E3F2FD', // Very light blue for highlights
//       light: '#F1F8FF',
//       dark: '#90CAF9',
//       contrastText: '#1F2937',
//     },
//     background: {
//       default: '#FFFFFF', // White background
//       paper: '#FFFFFF',
//     },
//     text: {
//       primary: '#1F2937', // Dark gray
//       secondary: '#4B5563', // Medium gray
//     },
//   },

//   components: {
//     MuiCard: {
//       styleOverrides: {
//         root: {
//           borderRadius: '16px',
//           transition: 'all 0.3s ease-in-out',
//         },
//       },
//       variants: [
//         {
//           props: { variant: 'glass' },
//           style: {
//             background: 'rgba(255, 255, 255, 0.7)',
//             backdropFilter: 'blur(10px)',
//             border: '1px solid rgba(255, 255, 255, 0.8)',
//             boxShadow: '0 4px 30px rgba(66, 133, 244, 0.15)', // subtle blue shadow
//             '&:hover': {
//               transform: 'translateY(-5px)',
//               boxShadow: '0 10px 25px rgba(66, 133, 244, 0.25)',
//             },
//           },
//         },
//       ],
//     },

//     MuiAppBar: {
//       styleOverrides: {
//         root: {
//          // background: '#4285F4', // Blue
//           color: '#FFFFFF',
//           backdropFilter: 'blur(10px)',
//           boxShadow: '0 4px 30px rgba(66, 133, 244, 0.2)',
//           borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
//         },
//       },
//     },

//     MuiButton: {
//       styleOverrides: {
//         root: {
//           borderRadius: '12px',
//           textTransform: 'none',
//           fontWeight: 600,
//           padding: '8px 20px',
//         },
//         contained: {
//           background: 'linear-gradient(45deg, #4285F4 0%, #6EA8FF 100%)',
//           color: '#FFFFFF',
//           '&:hover': {
//             background: 'linear-gradient(45deg, #3367D6 0%, #5B9CFF 100%)',
//             boxShadow: '0 4px 15px rgba(66, 133, 244, 0.4)',
//           },
//         },
//         outlined: {
//           borderColor: '#4285F4',
//           color: '#1F2937',
//           '&:hover': {
//             borderColor: '#3367D6',
//             background: 'rgba(66, 133, 244, 0.1)',
//           },
//         },
//       },
//     },
//   },

//   typography: {
//     fontFamily: [
//       'Inter',
//       '-apple-system',
//       'BlinkMacSystemFont',
//       '"Segoe UI"',
//       'Roboto',
//       '"Helvetica Neue"',
//       'Arial',
//       'sans-serif',
//       '"Apple Color Emoji"',
//       '"Segoe UI Emoji"',
//       '"Segoe UI Symbol"',
//     ].join(','),
//     h1: { fontWeight: 700, color: '#1F2937' },
//     h2: { fontWeight: 600, color: '#1F2937' },
//     h3: { fontWeight: 600, color: '#1F2937' },
//     h4: { fontWeight: 600, color: '#1F2937' },
//     h5: { fontWeight: 600, color: '#1F2937' },
//     h6: { fontWeight: 600, color: '#1F2937' },
//   },
// });

// export default theme;



import { createTheme } from '@mui/material/styles';
import background from '../assets/background.png'; // ✅ Import background image

const theme = createTheme({
  palette: {
    primary: {
      main: '#4285F4',
      light: '#6EA8FF',
      dark: '#3367D6',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#E3F2FD',
      light: '#F1F8FF',
      dark: '#90CAF9',
      contrastText: '#1F2937',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1F2937',
      secondary: '#4B5563',
    },
  },

  components: {
    // ✅ Global background image
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: `url(${background})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          backgroundColor: '#fafafa', // fallback color
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          transition: 'all 0.3s ease-in-out',
        },
      },
      variants: [
        {
          props: { variant: 'glass' },
          style: {
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            boxShadow: '0 4px 30px rgba(66, 133, 244, 0.15)',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 10px 25px rgba(66, 133, 244, 0.25)',
            },
          },
        },
      ],
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          color: '#FFFFFF',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 30px rgba(66, 133, 244, 0.2)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
         // background: 'rgba(255,255,255,0.1)',
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
          background: 'linear-gradient(45deg, #4285F4 0%, #6EA8FF 100%)',
          color: '#FFFFFF',
          '&:hover': {
            background: 'linear-gradient(45deg, #3367D6 0%, #5B9CFF 100%)',
            boxShadow: '0 4px 15px rgba(66, 133, 244, 0.4)',
          },
        },
        outlined: {
          borderColor: '#4285F4',
          color: '#1F2937',
          '&:hover': {
            borderColor: '#3367D6',
            background: 'rgba(66, 133, 244, 0.1)',
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
    h1: { fontWeight: 700, color: '#1F2937' },
    h2: { fontWeight: 600, color: '#1F2937' },
    h3: { fontWeight: 600, color: '#1F2937' },
    h4: { fontWeight: 600, color: '#1F2937' },
    h5: { fontWeight: 600, color: '#1F2937' },
    h6: { fontWeight: 600, color: '#1F2937' },
  },
});

export default theme;
