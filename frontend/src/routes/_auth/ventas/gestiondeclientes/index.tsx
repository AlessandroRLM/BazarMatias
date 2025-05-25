import { createFileRoute } from '@tanstack/react-router'
import ClientsManagement from '../../../../pages/clientes/ClientsManagementPage'

export const Route = createFileRoute('/_auth/ventas/gestiondeclientes/')({
  component: ClientPage
})

function ClientPage() {
  return <ClientsManagement />
}