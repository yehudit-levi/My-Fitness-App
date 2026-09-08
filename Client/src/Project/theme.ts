import { createTheme } from '@mui/material/styles';

// ערכת עיצוב כהה בהשראת אפליקציות כושר וספורט - כתום אנרגטי על רקע כהה ורציני,
// עם מבטא טורקיז/מנטה כדי שלא יהיה "רציני מדי". כל קומפוננטת MUI באתר (AppBar, Button,
// Card, Avatar, Accordion וכו') יורשת את הצבעים/הפינות/הגופן האלה אוטומטית דרך ה-ThemeProvider
// ב-App.tsx, כך שהעיצוב עקבי בכל מסך בלי לגעת בכל קובץ בנפרד.

const theme = createTheme({
  direction: 'rtl',
  palette: {
    mode: 'dark',
    primary: {
      main: '#FF6A00', // כתום אנרגטי - כפתורים ראשיים, מיתוג
      light: '#FF8A3D',
      dark: '#C94E00',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#17C3B2', // טורקיז/מנטה - מבטא רענן, פחות "רציני"
      light: '#4FD9CB',
      dark: '#0E8A7E',
      contrastText: '#06110F',
    },
    background: {
      default: '#0D1117',
      paper: '#161B22',
    },
    text: {
      primary: '#F0F2F5',
      secondary: '#9BA3AF',
    },
    divider: 'rgba(255,255,255,0.08)',
    success: {
      main: '#3DDC84',
    },
    error: {
      main: '#FF5C5C',
    },
    warning: {
      main: '#FFB020',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Rubik", "Segoe UI", Roboto, Arial, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#0D1117',
          backgroundImage:
            'radial-gradient(circle at 15% 0%, rgba(255,106,0,0.08), transparent 35%), radial-gradient(circle at 85% 20%, rgba(23,195,178,0.06), transparent 40%)',
          backgroundAttachment: 'fixed',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#11141A',
          backgroundImage: 'none',
          borderBottom: '1px solid rgba(255,106,0,0.25)',
          boxShadow: '0 2px 16px rgba(0,0,0,0.45)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          paddingInline: 18,
        },
        containedPrimary: {
          boxShadow: '0 4px 14px rgba(255,106,0,0.35)',
          '&:hover': {
            boxShadow: '0 6px 18px rgba(255,106,0,0.45)',
            transform: 'translateY(-1px)',
          },
          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#161B22',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 16,
          transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
          '&:hover': {
            borderColor: 'rgba(255,106,0,0.35)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.45)',
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: '2px solid #FF6A00',
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: '#161B22',
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.06)',
          '&:before': { display: 'none' },
          '&.Mui-expanded': { margin: '8px 0' },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export default theme;
