import { createFileRoute } from '@tanstack/react-router'
import UserViewPage from '../../../../pages/administracion/users/UserViewPage'

export const Route = createFileRoute('/_auth/administracion/usuarios/ver-usuario/$rut')({
  component: UserViewPage
})