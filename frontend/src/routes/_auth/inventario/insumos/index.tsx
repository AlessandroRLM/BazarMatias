import { createFileRoute } from '@tanstack/react-router'
import SupplyManagementPage from '../../../../pages/inventario/supplies/SupplyManagementPage'

export const Route = createFileRoute('/_auth/inventario/insumos/')({
  component: InsumosRouteComponent
})

function InsumosRouteComponent() {
  return <SupplyManagementPage />
}