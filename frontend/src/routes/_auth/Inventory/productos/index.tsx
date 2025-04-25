import { createFileRoute } from '@tanstack/react-router'
import InventoryManagementPage from '../../../../pages/Inventory/InventoryManagementPage'

export const Route = createFileRoute('/_auth/Inventory/productos/')({
  component: ProductsRouteComponent
})

function ProductsRouteComponent() {
  return <InventoryManagementPage />
}