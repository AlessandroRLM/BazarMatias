import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/administracion/usuarios/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/administracion/usuarios/"!</div>
}
