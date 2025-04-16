import { RouterProvider, createRouter } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Auth imports
import { useAuth } from './hooks/auth/useAuth'
import { AuthProvider } from './providers/auth/AuthProvider'

// React Query imports
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Create a new router instance
const router = createRouter({ 
  routeTree,
  context: {
    auth: undefined!,
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
  return <RouterProvider router={ router } context={{ auth }} />
}

const queryClient = new QueryClient()

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={ queryClient }>
        <InnerApp/>
        <TanStackRouterDevtools router={router} />
      </QueryClientProvider >
    </AuthProvider>
  )
}

export default App
