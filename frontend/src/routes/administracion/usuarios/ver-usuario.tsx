import { createFileRoute } from '@tanstack/react-router'
import UserViewPage from '../../../pages/administracion/UserViewPage'

export const Route = createFileRoute('/administracion/usuarios/ver-usuario')({
  component: UserViewPage
})
