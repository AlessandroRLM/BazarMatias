import { createFileRoute } from '@tanstack/react-router'
import EditarMerma from '../../../../pages/mermas/EditShrinkage'

export const Route = createFileRoute('/_auth/inventario/mermas/editar-merma/$id')({
  component: EditarMermaPage,
})

function EditarMermaPage() {
  return <EditarMerma/>
}
