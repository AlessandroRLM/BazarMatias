import { createFileRoute } from '@tanstack/react-router'
import EditOrder from '../../../../pages/ordendetrabajo/EditWorkOrder'

export const Route = createFileRoute('/_auth/ventas/ordenesdetrabajo/editar-orden-trabajo',)({
  component: EditWorkOrderPage,
})

function EditWorkOrderPage() {
  return <EditOrder/>
}