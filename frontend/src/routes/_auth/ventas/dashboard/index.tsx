import { createFileRoute } from '@tanstack/react-router'
import DashboardSalePage from '../../../../pages/ventas/DashboardSalesPage'

export const Route = createFileRoute('/_auth/ventas/dashboard/')({
  component: DashboardPage
})

function DashboardPage() {
  return <DashboardSalePage />
}