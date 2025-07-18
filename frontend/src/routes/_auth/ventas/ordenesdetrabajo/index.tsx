import { createFileRoute } from '@tanstack/react-router'
import OrderManagementPage  from '../../../../pages/ventas/workOrders/OrderWorkManagementPage'

export const Route = createFileRoute('/_auth/ventas/ordenesdetrabajo/')({
  component: OrderWorkPage
})

function OrderWorkPage() {
  return <OrderManagementPage /> 
}