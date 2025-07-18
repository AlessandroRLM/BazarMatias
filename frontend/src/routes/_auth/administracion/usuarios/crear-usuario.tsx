import { createFileRoute } from '@tanstack/react-router'
import UserCreation from '../../../../pages/administracion/users/UserCreation'

export const Route = createFileRoute('/_auth/administracion/usuarios/crear-usuario')({
  component: UserCreationPage
})

function UserCreationPage() {
  return <UserCreation />
}