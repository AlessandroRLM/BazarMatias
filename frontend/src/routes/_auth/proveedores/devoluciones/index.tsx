import { createFileRoute } from '@tanstack/react-router'
import ReturnManagementPage  from '../../../../pages/devoluciones/ReturnManagementPage'

export const Route = createFileRoute('/_auth/proveedores/devoluciones/')({
  component: ReturnPage
})

function ReturnPage() {
  return <ReturnManagementPage /> 
}