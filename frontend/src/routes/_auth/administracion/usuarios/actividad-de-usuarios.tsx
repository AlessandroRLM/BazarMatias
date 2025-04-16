import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/administracion/usuarios/actividad-de-usuarios')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/administracion/usuarios/usersActivity"!</div>
}
