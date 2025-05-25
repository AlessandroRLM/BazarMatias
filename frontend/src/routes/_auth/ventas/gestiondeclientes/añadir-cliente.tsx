import { createFileRoute } from '@tanstack/react-router'
import ClientCreate from '../../../../pages/clientes/ClientCreate'

export const Route = createFileRoute('/_auth/ventas/gestiondeclientes/añadir-cliente')({
  component: ClientCreatePage
})

function ClientCreatePage() {
  return <ClientCreate />
}