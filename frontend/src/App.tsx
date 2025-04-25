import { RouterProvider, createRouter } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Auth imports
import { useAuth } from './hooks/auth/useAuth'
import { AuthProvider } from './providers/auth/AuthProvider'

// React Query imports
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Box, CircularProgress } from '@mui/joy'

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

export const queryClient = new QueryClient()

// Create a new router instance
const router = createRouter({
  routeTree,
  defaultPendingComponent: () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100dvh' }}>
      <CircularProgress />
    </Box>
  ),
  context: {
    auth: undefined!,
    queryClient,
  },
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function InnerApp() {
  const auth = useAuth()
  return <RouterProvider router={router} context={{ auth, }} />
}


function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <InnerApp />
          <TanStackRouterDevtools router={router} />
        </AuthProvider>
      </QueryClientProvider >
    </LocalizationProvider>

  )
}

export default App
