import { createFileRoute } from '@tanstack/react-router'
import QuoteCreationPage from '../../../../pages/ventas/quotes/QuoteCreationPage'

export const Route = createFileRoute(
  '/_auth/ventas/cotizaciones/crear-cotizacion',
)({
  component: QuoteCreationPage,
})
