import { createFileRoute } from '@tanstack/react-router'
import EditarProveedor from '../../../pages/proveedores/supplier/EditSupplier'

export const Route = createFileRoute('/_auth/proveedores/editar-proveedor/$id')({
  component: ProductViewPage
})

function ProductViewPage() {
  return <EditarProveedor />
}