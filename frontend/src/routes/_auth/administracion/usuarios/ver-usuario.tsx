import { createFileRoute } from '@tanstack/react-router'
import UserViewPage from '../../../../pages/administracion/UserViewPage'

export const Route = createFileRoute('/_auth/administracion/usuarios/ver-usuario')({
  component: UserViewPage
})
