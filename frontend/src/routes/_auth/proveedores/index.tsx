import { createFileRoute } from '@tanstack/react-router'
import SuppliersManagementPage  from '../../../pages/proveedores/supplier/SuppliersManagementPage'

export const Route = createFileRoute('/_auth/proveedores/')({
  
  component: SuppliersPage
})

function SuppliersPage() {
  return <SuppliersManagementPage /> 
}