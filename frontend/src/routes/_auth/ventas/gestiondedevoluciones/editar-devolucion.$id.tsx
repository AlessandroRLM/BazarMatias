import { createFileRoute } from '@tanstack/react-router'
import ReturnEdit from '../../../../pages/ventas/returnSales/ReturnEdit'

export const Route = createFileRoute('/_auth/ventas/gestiondedevoluciones/editar-devolucion/$id')({
  component: ReturnEdit
})
