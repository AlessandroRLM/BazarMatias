import { createFileRoute } from '@tanstack/react-router'
import InventoryManagementPage from '../../../../pages/inventario/InventoryManagementPage'

export const Route = createFileRoute('/_auth/inventario/productos/')({
  component: ProductsRouteComponent
})

function ProductsRouteComponent() {
  return <InventoryManagementPage />
}