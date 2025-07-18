import { createFileRoute } from '@tanstack/react-router'
import VerProducto from '../../../../pages/inventario/inventory/ProductViewPage'

export const Route = createFileRoute('/_auth/inventario/productos/ver-producto/$id')({
  component: ProductViewPage
})

function ProductViewPage() {
  return <VerProducto />
}