import { createFileRoute } from '@tanstack/react-router'
import EditReturn from '../../../../pages/proveedores/returnSuppliers/EditReturn'

export const Route = createFileRoute('/_auth/proveedores/devoluciones/editar-devolucion/$id')({
  component: EditReturnPage
})

function EditReturnPage() {
  return <EditReturn /> 
}