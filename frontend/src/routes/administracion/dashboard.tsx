import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/administracion/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/administracion/dashboard"!</div>
}
