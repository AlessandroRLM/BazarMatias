import { createFileRoute } from '@tanstack/react-router'
import SuppliersManagementPage  from '../../../../pages/proveedores/SuppliersManagementPage'

export const Route = createFileRoute('/_auth/proveedores/proveedores/')({
  component: SuppliersPage
})

function SuppliersPage() {
  return <SuppliersManagementPage /> 
}