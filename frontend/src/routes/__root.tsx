import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { AuthContextType } from '../types/auth.types'

interface RouterContext {
  auth: AuthContextType
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => <Outlet />
})
