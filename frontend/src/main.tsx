import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { CssBaseline, CssVarsProvider, extendTheme, GlobalStyles } from '@mui/joy'
declare module '@mui/joy/Avatar' {
  interface AvatarPropsSizeOverrides {
    profile:true
  }
}

const theme = extendTheme({
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
    <CssVarsProvider theme={theme}>
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
  </StrictMode>,
)
