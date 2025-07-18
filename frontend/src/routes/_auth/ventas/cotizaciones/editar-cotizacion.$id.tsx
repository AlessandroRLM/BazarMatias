import { createFileRoute } from '@tanstack/react-router'
import QuoteEditPage from '../../../../pages/ventas/quotes/QuoteEditPage'

export const Route = createFileRoute(
  '/_auth/ventas/cotizaciones/editar-cotizacion/$id',
)({  
  component: QuoteEditPage,
})
