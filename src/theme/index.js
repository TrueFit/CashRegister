import { createTheme } from '@mui/material/styles'
import { grey } from '@mui/material/colors'

export function createAppTheme(mode = 'light') {
  const isDark = mode === 'dark'
  const palette = isDark
    ? {
        mode: 'dark',
        primary: { main: grey[300] },
        secondary: { main: grey[500] },
        background: { default: '#121212', paper: '#1a1a1a' },
        text: { primary: grey[100], secondary: grey[400] }
      }
    : {
        mode: 'light',
        primary: { main: grey[800] },
        secondary: { main: grey[600] },
        background: { default: '#f5f5f5', paper: '#ffffff' },
        text: { primary: grey[900], secondary: grey[700] }
      }

  return createTheme({
    palette,
    custom: {
      headerStripe: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
    },
    shape: { borderRadius: 8 },
    typography: {
      fontSize: 15,
      fontWeightMedium: 600,
      fontFamily: "'Rubik', ui-sans-serif, system-ui, -apple-system, sans-serif"
    },
    components: {
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: { textTransform: 'none', fontWeight: 600 }
        }
      },
      MuiAppBar: {
        styleOverrides: {
          root: { borderBottom: isDark ? '1px solid #2a2a2a' : '1px solid #e5e5e5' }
        }
      },
      MuiPaper: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          rounded: { borderRadius: 8 }
        }
      }
    }
  })
}
