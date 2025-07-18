import { createFileRoute } from '@tanstack/react-router'
import EditarInsumo from '../../../../pages/inventario/supplies/EditSupply'

export const Route = createFileRoute('/_auth/inventario/insumos/editar-insumo/$id')({
  component: EditarInsumo,
})
