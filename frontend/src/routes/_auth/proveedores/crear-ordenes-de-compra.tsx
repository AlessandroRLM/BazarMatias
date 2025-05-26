import { createFileRoute } from '@tanstack/react-router'
import BuyOrderCreation from '../../../pages/ordenesCompra/BuyOrderCreation'


export const Route = createFileRoute(
  '/_auth/proveedores/crear-ordenes-de-compra',
)({
  component: BuyOrderCreation,
})

