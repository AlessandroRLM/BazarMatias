import { createFileRoute } from '@tanstack/react-router'
import CreateSuppliers  from '../../../pages/proveedores/supplier/CreateSuppliers'

export const Route = createFileRoute('/_auth/proveedores/crear-proveedor')({
  component: SuppliersPage
})

function SuppliersPage() {
  return <CreateSuppliers /> 
}