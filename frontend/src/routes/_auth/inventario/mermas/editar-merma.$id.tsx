import { createFileRoute } from '@tanstack/react-router'
import EditarMerma from '../../../../pages/inventario/shrinkages/EditShrinkage'

export const Route = createFileRoute('/_auth/inventario/mermas/editar-merma/$id')({
  component: EditarMerma,
})
