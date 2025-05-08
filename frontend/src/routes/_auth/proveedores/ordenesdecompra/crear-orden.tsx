import { createFileRoute } from '@tanstack/react-router'
import CreateOrder from '../../../../pages/ordenesdecompra/CreateOrder'

export const Route = createFileRoute('/_auth/proveedores/ordenesdecompra/crear-orden',)({
  component: CreateOrderPage,
})

function CreateOrderPage() {
  return <CreateOrder />
}
