import { createFileRoute } from '@tanstack/react-router'
import VerProveedor from '../../../pages/proveedores/SupplierView'

export const Route = createFileRoute('/_auth/proveedores/ver-proveedor/$id')({
  component: ProductViewPage
})

function ProductViewPage() {
  return <VerProveedor />
}