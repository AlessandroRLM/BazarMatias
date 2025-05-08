import { createFileRoute } from '@tanstack/react-router'
import EditOrder from '../../../../pages/ordenesdecompra/EditOrder'

export const Route = createFileRoute('/_auth/proveedores/ordenesdecompra/editar-orden',)({
  component: EditOrderPage,
})

function EditOrderPage() {
  return <EditOrder/>
}