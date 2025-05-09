import { createFileRoute } from '@tanstack/react-router'
import ReturnView from '../../../../pages/devoluciones/ReturnView'

export const Route = createFileRoute('/_auth/proveedores/devoluciones/ver-devolucion')({
  component: ReturnViewPage
})

function ReturnViewPage() {
  return <ReturnView /> 
}