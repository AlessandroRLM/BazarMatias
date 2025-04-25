import { createFileRoute } from '@tanstack/react-router'
import EditarProducto from '../../../../pages/Inventory/EditProduct'

export const Route = createFileRoute('/_auth/Inventory/productos/editar-producto/$id')({
  component: ProductViewPage
})

function ProductViewPage() {
  return <EditarProducto />
}