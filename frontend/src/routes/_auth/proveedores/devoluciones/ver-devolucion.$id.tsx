import { createFileRoute } from '@tanstack/react-router'
import ReturnView from '../../../../pages/proveedores/returnSuppliers/ReturnView'

export const Route = createFileRoute('/_auth/proveedores/devoluciones/ver-devolucion/$id')({
  component: ReturnViewPage
})

function ReturnViewPage() {
  return <ReturnView /> 
}