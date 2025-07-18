import { createFileRoute } from '@tanstack/react-router'
import ClientEdit from '../../../../pages/ventas/clients/ClientEdit'

export const Route = createFileRoute('/_auth/ventas/gestiondeclientes/editar-cliente/$id')({
  component: ClientEdit
})