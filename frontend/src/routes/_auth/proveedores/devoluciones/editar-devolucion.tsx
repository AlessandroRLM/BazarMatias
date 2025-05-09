import { createFileRoute } from '@tanstack/react-router'
import EditReturn from '../../../../pages/devoluciones/EditReturn'

export const Route = createFileRoute('/_auth/proveedores/devoluciones/editar-devolucion')({
  component: EditReturnPage
})

function EditReturnPage() {
  return <EditReturn /> 
}