import { createFileRoute } from '@tanstack/react-router'
import SalesDetail from '../../../../pages/ventas/SalesDetail'

export const Route = createFileRoute('/_auth/ventas/gestiondeventas/ver-venta/$id')({
  component: SalesDetail
})
