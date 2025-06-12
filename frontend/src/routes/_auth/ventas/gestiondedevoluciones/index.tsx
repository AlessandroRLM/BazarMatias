import { createFileRoute } from '@tanstack/react-router'
import ReturnManagementPage from '../../../../pages/devoluciones_ventas/ReturnManagementPage'

export const Route = createFileRoute('/_auth/ventas/gestiondedevoluciones/')({
  component: ReturnPage
})

function ReturnPage() {
  return <ReturnManagementPage />
}