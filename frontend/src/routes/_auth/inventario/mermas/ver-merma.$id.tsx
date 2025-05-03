import { createFileRoute } from '@tanstack/react-router'
import VerMerma from '../../../../pages/mermas/ShrinkageView'

export const Route = createFileRoute('/_auth/inventario/mermas/ver-merma/$id')({
  component: VerMermaPage,
})

function VerMermaPage() {
  return <VerMerma/>
}
