import { createFileRoute } from '@tanstack/react-router'
import OrderView from '../../../../pages/ordendetrabajo/OrderWorkView'

export const Route = createFileRoute('/_auth/ventas/ordenesdetrabajo/ver-orden-trabajo/$id',)({
  component: OrderWorkViewPage,
})

function OrderWorkViewPage() {
  return <OrderView/>
}