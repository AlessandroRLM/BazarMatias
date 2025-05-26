import { createFileRoute } from '@tanstack/react-router'
import { zodValidator } from '@tanstack/zod-adapter'

import { queryClient } from '../../../App'
import { buyOrderSearchSchema } from '../../../schemas/proveedores/buyOrderSearchSchema'
import { buyOrderQueryOptions } from '../../../utils/proveedores/suppliersQueryOptions'
import BuyOrderManagementPage from '../../../pages/ordenesCompra/buyOrderManagementPage'

export const Route = createFileRoute('/_auth/proveedores/ordenes-de-compra')({
    validateSearch: zodValidator(buyOrderSearchSchema),
    loaderDeps: ({ search }) => search,
    loader: ({ deps }) => queryClient.prefetchQuery(buyOrderQueryOptions(deps)),
    component: BuyOrderManagementPage,
})

