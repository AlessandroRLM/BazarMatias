import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { CssBaseline, CssVarsProvider, extendTheme, GlobalStyles } from '@mui/joy'
import { createTheme, ThemeProvider, THEME_ID as MATERIAL_THEME_ID } from '@mui/material'
declare module '@mui/joy/Avatar' {
  interface AvatarPropsSizeOverrides {
    profile:true
  }
}

const materialTheme = createTheme()

const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        // Puedes personalizar los colores del tema claro aquí si lo deseas
      },
    },
    dark: {
      palette: {
        // Puedes personalizar los colores del tema oscuro aquí si lo deseas
      },
    },
  },
  components: {
    JoyAvatar: {
      styleOverrides: {
        root: ({ownerState}) => ({
          ...(ownerState.size === 'profile' && {
            width: '186px',
            height: '186px',
            borderRadius: 'var(--Avatar-radius, 50%)',
            fontSize: '64px',
          }),
        })
      }
    }
  },
}) 


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={{ [MATERIAL_THEME_ID]: materialTheme}}>
      <CssVarsProvider theme={theme} defaultMode="light" modeStorageKey="bazar-matias-color-scheme">
        <CssBaseline>
          <GlobalStyles
            styles={(theme) => ({
              ':root': {
                '--Sidebar-width': '220px',
                [theme.breakpoints.up('lg')]: {
                  '--Sidebar-width': '240px',
                },
                '--Header-height': '56px',
                [theme.breakpoints.up('md')]: {
                  '--Header-height': '0px',
                },
              },
            })}
          />
          <App />
        </CssBaseline>
      </CssVarsProvider>
    </ThemeProvider>
  </StrictMode>,
)
