import { createFileRoute } from '@tanstack/react-router'
import ReturnView from '../../../../pages/devoluciones_ventas/ReturnView'

export const Route = createFileRoute('/_auth/ventas/gestiondedevoluciones/ver-devolucion/$id')({
  component: ReturnView
})
