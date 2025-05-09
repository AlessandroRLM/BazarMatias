import { createFileRoute } from '@tanstack/react-router'
import BuyOrderDetail from '../../../pages/ordenesCompra/BuyOrderDetail'

export const Route = createFileRoute(
  '/_auth/proveedores/ver-ordenes-de-compra/$id',
)({
  component: BuyOrderDetail,
})
