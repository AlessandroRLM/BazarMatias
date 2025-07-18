import { createFileRoute } from '@tanstack/react-router'
import CrearInsumo from '../../../../pages/inventario/supplies/CreateSupply'

export const Route = createFileRoute('/_auth/inventario/insumos/crear-insumo')({
  component: CrearInsumoPage,
})

function CrearInsumoPage() {
  return <CrearInsumo/>
}
