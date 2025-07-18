import { createFileRoute } from '@tanstack/react-router'
import BuyOrderDetail from '../../../../pages/proveedores/buyOrders/BuyOrderDetail'

export const Route = createFileRoute(
  '/_auth/proveedores/ordenes-de-compra/ver-ordenes-de-compra/$id',
)({
  component: BuyOrderDetail,
})
