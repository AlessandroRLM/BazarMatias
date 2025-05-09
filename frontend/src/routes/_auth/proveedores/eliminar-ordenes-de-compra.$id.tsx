import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_auth/proveedores/eliminar-ordenes-de-compra/$id',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_auth/proveedores/eliminar-ordenes-de-compra/$id"!</div>
}
