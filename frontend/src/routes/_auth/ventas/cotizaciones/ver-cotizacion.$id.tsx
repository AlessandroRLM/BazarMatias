import { createFileRoute } from '@tanstack/react-router'
import QuoteViewPage from '../../../../pages/ventas/quotes/QuoteViewPage'

export const Route = createFileRoute(
  '/_auth/ventas/cotizaciones/ver-cotizacion/$id',
)({
  component: QuoteViewPage,
})
