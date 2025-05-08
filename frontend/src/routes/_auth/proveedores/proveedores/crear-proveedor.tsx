import { createFileRoute } from '@tanstack/react-router'
import CreateSuppliers  from '../../../../pages/proveedores/CreateSuppliers'

export const Route = createFileRoute('/_auth/proveedores/proveedores/crear-proveedor')({
  component: SuppliersPage
})

function SuppliersPage() {
  return <CreateSuppliers /> 
}