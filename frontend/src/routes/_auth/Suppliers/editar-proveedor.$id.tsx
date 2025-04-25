import { createFileRoute } from '@tanstack/react-router'
import EditarProveedor from '../../../pages/proveedores/EditSupplier'

export const Route = createFileRoute('/_auth/Suppliers/editar-proveedor/$id')({
  component: ProductViewPage
})

function ProductViewPage() {
  return <EditarProveedor />
}