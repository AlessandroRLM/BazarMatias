import { createFileRoute } from '@tanstack/react-router'
import DashboardInventoryPage from '../../../pages/inventario/DashboardInventoryPage'

export const Route = createFileRoute('/_auth/inventario/dashboard')({
  component: DashboardInventoryPage,
})

