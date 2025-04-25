import { createFileRoute } from '@tanstack/react-router'
import VerProducto from '../../../../pages/Inventory/ProductViewPage'

export const Route = createFileRoute('/_auth/Inventory/productos/ver-producto')({
  component: ProductViewPage
})

function ProductViewPage() {
  return <VerProducto />
}