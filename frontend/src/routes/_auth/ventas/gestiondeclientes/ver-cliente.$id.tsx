import { createFileRoute } from '@tanstack/react-router'
import ClientView from '../../../../pages/ventas/clients/ClientView'

export const Route = createFileRoute('/_auth/ventas/gestiondeclientes/ver-cliente/$id')({
  component: ClientView
})