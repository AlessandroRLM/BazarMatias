import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { AuthContextType } from '../types/auth.types'
import { QueryClient } from '@tanstack/react-query'

interface RouterContext {
  auth: AuthContextType
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => <Outlet />
})
