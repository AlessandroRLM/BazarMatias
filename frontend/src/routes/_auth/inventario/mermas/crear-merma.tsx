import { createFileRoute } from '@tanstack/react-router'
import RegistrarMerma from '../../../../pages/mermas/CreateShrinkage'

export const Route = createFileRoute('/_auth/inventario/mermas/crear-merma')({
  component: RegistrarMermaPage,
})

function RegistrarMermaPage() {
  return <RegistrarMerma/>
}
