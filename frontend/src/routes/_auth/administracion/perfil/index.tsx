import { createFileRoute } from '@tanstack/react-router'
import ProfilePage from '../../../../pages/administracion/ProfilePage'
import UserProfileFormProvider from '../../../../providers/administracion/UserProfileFormProvider'

export const Route = createFileRoute('/_auth/administracion/perfil/')({
  component: ProfileComponent,
})


function ProfileComponent () {
  return (
    <UserProfileFormProvider>
      <ProfilePage />
    </UserProfileFormProvider>
  )
}