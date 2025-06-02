import { createFileRoute } from '@tanstack/react-router'
import RequestPasswordResetPage from '../pages/auth/RequestPasswordResetPage/RequestResetPasswordPage'

export const Route = createFileRoute('/restablecer-contrasena')({
  component: RequestPasswordResetPage,
})
