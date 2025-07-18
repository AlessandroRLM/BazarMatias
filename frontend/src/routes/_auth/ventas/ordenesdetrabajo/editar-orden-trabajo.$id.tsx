import { createFileRoute } from '@tanstack/react-router'
import EditOrder from '../../../../pages/ventas/workOrders/EditWorkOrder'

export const Route = createFileRoute('/_auth/ventas/ordenesdetrabajo/editar-orden-trabajo/$id',)({
  component: EditWorkOrderPage,
})

function EditWorkOrderPage() {
  return <EditOrder/>
}