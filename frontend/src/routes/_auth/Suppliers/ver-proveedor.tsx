import { createFileRoute } from '@tanstack/react-router'
import VerProveedor from '../../../pages/proveedores/SupplierView'

export const Route = createFileRoute('/_auth/Suppliers/ver-proveedor')({
  component: ProductViewPage
})

function ProductViewPage() {
  return <VerProveedor />
}