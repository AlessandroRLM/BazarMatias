import { createFileRoute } from '@tanstack/react-router'
import DashboardSupplierPage from '../../../pages/proveedores/DashboardSupplierPage'

export const Route = createFileRoute('/_auth/proveedores/dashboard',)({
  component: EditOrderPage,
})

function EditOrderPage() {
  return <DashboardSupplierPage/>
}