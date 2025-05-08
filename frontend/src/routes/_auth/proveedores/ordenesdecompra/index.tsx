import { createFileRoute } from '@tanstack/react-router'
import OrderManagementPage  from '../../../../pages/ordenesdecompra/OrderManagementPage'

export const Route = createFileRoute('/_auth/proveedores/ordenesdecompra/')({
  component: OrderPage
})

function OrderPage() {
  return <OrderManagementPage /> 
}