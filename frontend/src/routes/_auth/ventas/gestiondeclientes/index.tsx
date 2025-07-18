import { createFileRoute } from '@tanstack/react-router'
import ClientsManagement from '../../../../pages/ventas/clients/ClientsManagementPage'

export const Route = createFileRoute('/_auth/ventas/gestiondeclientes/')({
  component: ClientPage
})

function ClientPage() {
  return <ClientsManagement />
}