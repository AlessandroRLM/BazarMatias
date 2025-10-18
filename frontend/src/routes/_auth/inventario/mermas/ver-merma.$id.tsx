import { createFileRoute } from '@tanstack/react-router'
import VerMerma from '../../../../pages/inventario/shrinkages/ShrinkageView'

export const Route = createFileRoute('/_auth/inventario/mermas/ver-merma/$id')({
  component: VerMerma,
})
