import { createFileRoute } from '@tanstack/react-router'
import ClientCreate from '../../../../pages/ventas/clients/ClientCreate'

export const Route = createFileRoute('/_auth/ventas/gestiondeclientes/añadir-cliente')({
  component: ClientCreatePage
})

function ClientCreatePage() {
  return <ClientCreate />
}