import { createFileRoute } from '@tanstack/react-router'
import CreateOrder from '../../../../pages/ordendetrabajo/CreateWorkOrder'

export const Route = createFileRoute('/_auth/ventas/ordenesdetrabajo/crear-orden-trabajo',)({
  component: CreateWorkOrderPage,
})

function CreateWorkOrderPage() {
  return <CreateOrder />
}
