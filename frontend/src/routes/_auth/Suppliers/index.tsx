import { createFileRoute } from '@tanstack/react-router'
import SuppliersManagementPage  from '../../../pages/proveedores/SuppliersManagementPage'

export const Route = createFileRoute('/_auth/Suppliers/')({
  component: SuppliersPage
})

function SuppliersPage() {
  return <SuppliersManagementPage /> 
}