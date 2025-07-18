import { createFileRoute } from '@tanstack/react-router'
import BuyOrderCreation from '../../../../pages/proveedores/buyOrders/BuyOrderCreation'


export const Route = createFileRoute(
  '/_auth/proveedores/ordenes-de-compra/crear-ordenes-de-compra',
)({
  component: BuyOrderCreation,
})

