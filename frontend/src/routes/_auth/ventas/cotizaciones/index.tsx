import { createFileRoute } from '@tanstack/react-router'
import { zodValidator } from '@tanstack/zod-adapter'

import QuoteManagementPage from '../../../../pages/ventas/quotes/QuoteManagementPage'
import { quoteSearchSchema } from '../../../../schemas/ventas/cotizaciones/quoteSearchSchema'
import { quotesQueryOptions } from '../../../../utils/ventas/salesQueryOptions'
import { queryClient } from '../../../../App'

export const Route = createFileRoute('/_auth/ventas/cotizaciones/')({
    validateSearch: zodValidator(quoteSearchSchema),
    loaderDeps: ({ search }) => search,
    loader: ({ deps }) => queryClient.prefetchQuery(quotesQueryOptions(deps)),
    component: QuoteManagementPage,
})
