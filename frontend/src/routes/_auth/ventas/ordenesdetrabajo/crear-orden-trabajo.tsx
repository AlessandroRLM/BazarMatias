import { createFileRoute } from '@tanstack/react-router'
import CreateOrder from '../../../../pages/ventas/workOrders/CreateWorkOrder'

export const Route = createFileRoute('/_auth/ventas/ordenesdetrabajo/crear-orden-trabajo',)({
  component: CreateWorkOrderPage,
})

function CreateWorkOrderPage() {
  return <CreateOrder />
}
