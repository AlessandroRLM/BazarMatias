import { createFileRoute } from '@tanstack/react-router'
import EditOrder from '../../../../pages/ordendetrabajo/EditWorkOrder'

export const Route = createFileRoute('/_auth/proveedores/ordenesdecompra/editar-orden',)({
  component: EditOrderPage,
})

function EditOrderPage() {
  return <EditOrder/>
}