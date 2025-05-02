// src/routes/_auth/inventario/mermas/route.tsx
import { createFileRoute } from '@tanstack/react-router'
import ShrinkageManagementPage from '../../../../pages/mermas/ShrinkageManagementPage'

export const Route = createFileRoute('/_auth/inventario/mermas/')({
  component: MermasRouteComponent
})

function MermasRouteComponent() {
  return <ShrinkageManagementPage />
}