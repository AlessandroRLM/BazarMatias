import { createFileRoute } from '@tanstack/react-router'
import OrderView from '../../../../pages/ordenesdecompra/OrderView'

export const Route = createFileRoute('/_auth/proveedores/ordenesdecompra/ver-orden',)({
  component: OrderViewPage,
})

function OrderViewPage() {
  return <OrderView/>
}