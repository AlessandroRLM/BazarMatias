import { createFileRoute } from '@tanstack/react-router'
import QuoteCreationPage from '../../../../pages/cotizaciones/QuoteCreationPage'

export const Route = createFileRoute(
  '/_auth/ventas/cotizaciones/crear-cotizacion',
)({
  component: QuoteCreationPage,
})
