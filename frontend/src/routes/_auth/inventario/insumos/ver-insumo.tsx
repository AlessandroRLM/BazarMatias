import { createFileRoute } from '@tanstack/react-router'
import VerInsumo from '../../../../pages/insumos/SupplyView'

export const Route = createFileRoute('/_auth/inventario/insumos/ver-insumo')({
  component: VerInsumoPage,
})

function VerInsumoPage() {
  return <VerInsumo />
}
