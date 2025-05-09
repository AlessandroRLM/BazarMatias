import { createFileRoute } from '@tanstack/react-router'
import BuyOrderEdit from '../../../pages/ordenesCompra/buyOrderEdit'

export const Route = createFileRoute(
  '/_auth/proveedores/editar-ordenes-de-compra/$id',
)({
  component: BuyOrderEdit,
})

