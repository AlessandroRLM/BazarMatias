import { createFileRoute } from '@tanstack/react-router'
import EditarProducto from '../../../../pages/inventario/inventory/EditProduct'

export const Route = createFileRoute('/_auth/inventario/productos/editar-producto/$id')({
  component: ProductViewPage
})

function ProductViewPage() {
  return <EditarProducto />
}