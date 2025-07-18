import { createFileRoute } from '@tanstack/react-router'
import VerInsumo from '../../../../pages/inventario/supplies/SupplyView'

export const Route = createFileRoute('/_auth/inventario/insumos/ver-insumo/$id')({
  component: VerInsumo,
})
