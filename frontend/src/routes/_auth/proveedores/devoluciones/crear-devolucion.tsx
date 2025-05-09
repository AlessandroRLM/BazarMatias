import { createFileRoute } from '@tanstack/react-router'
import CreateReturn from '../../../../pages/devoluciones/CreateReturn'

export const Route = createFileRoute('/_auth/proveedores/devoluciones/crear-devolucion')({
  component: CreateReturnPage
})

function CreateReturnPage() {
  return <CreateReturn /> 
}