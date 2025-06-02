import { createFileRoute } from '@tanstack/react-router'
import PasswordResetConfirmPage from '../pages/auth/PasswordResetConfirmPage/PasswordResetConfirmPage'

export const Route = createFileRoute('/confirmar-contrasena/$uid/$token/')({
  component: PasswordResetConfirmPage,
})
