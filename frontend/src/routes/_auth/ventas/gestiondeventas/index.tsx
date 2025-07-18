import { createFileRoute } from '@tanstack/react-router'
import SalesManagement from '../../../../pages/ventas/sales/SalesManagementPage'

export const Route = createFileRoute('/_auth/ventas/gestiondeventas/')({
  component: SalesPage
})

function SalesPage() {
  return <SalesManagement />
}