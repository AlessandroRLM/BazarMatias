import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { CssBaseline, CssVarsProvider, GlobalStyles } from '@mui/joy'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CssVarsProvider>
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
