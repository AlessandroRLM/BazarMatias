import { createFileRoute } from '@tanstack/react-router'
import ReturnCreate from '../../../../pages/devoluciones_ventas/ReturnCreate'

export const Route = createFileRoute('/_auth/ventas/gestiondedevoluciones/añadir-devolucion')({
  component: ReturnCreatePage
})

function ReturnCreatePage() {
  return <ReturnCreate />
}