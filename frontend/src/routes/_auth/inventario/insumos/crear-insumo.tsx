import { createFileRoute } from '@tanstack/react-router'
import CrearInsumo from '../../../../pages/insumos/CreateSupply'

export const Route = createFileRoute('/_auth/inventario/insumos/crear-insumo')({
  component: CrearInsumoPage,
})

function CrearInsumoPage() {
  return <CrearInsumo/>
}
