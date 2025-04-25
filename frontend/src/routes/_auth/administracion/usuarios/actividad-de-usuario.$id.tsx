import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_auth/administracion/usuarios/actividad-de-usuario/$id',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>Hello "/_auth/administracion/usuarios/actividad-de-usuario/$id"!</div>
  )
}
