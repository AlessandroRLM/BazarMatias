import { createFileRoute } from '@tanstack/react-router'
import BuyOrderEdit from '../../../../pages/proveedores/buyOrders/buyOrderEdit'

export const Route = createFileRoute(
  '/_auth/proveedores/ordenes-de-compra/editar-ordenes-de-compra/$id',
)({
  component: BuyOrderEdit,
})

