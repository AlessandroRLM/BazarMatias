import { createFileRoute } from '@tanstack/react-router'
import ReturnView from '../../../../pages/ventas/returnSales/ReturnView'

export const Route = createFileRoute('/_auth/ventas/gestiondedevoluciones/ver-devolucion/$id')({
  component: ReturnView
})
