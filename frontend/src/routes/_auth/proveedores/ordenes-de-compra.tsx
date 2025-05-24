import { createFileRoute } from '@tanstack/react-router'
import { zodValidator } from '@tanstack/zod-adapter'
import { buyOrderSearchSchema } from '../../../schemas/proveedores/buyOrderSearchSchema'
import { buyOrderQueryOptions } from '../../../utils/proveedores/suppliersQueryOptions'

import { queryClient } from '../../../App'
import buyOrderManagementPage from '../../../pages/ordenesCompra/BuyOrderManagementPage'

export const Route = createFileRoute('/_auth/proveedores/ordenes-de-compra')({
    validateSearch: zodValidator(buyOrderSearchSchema),
    loaderDeps: ({ search }) => search,
    loader: ({ deps }) => queryClient.prefetchQuery(buyOrderQueryOptions(deps)),
    component: buyOrderManagementPage,
})

