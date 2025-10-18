import { createFileRoute } from '@tanstack/react-router'
import { zodValidator } from '@tanstack/zod-adapter'
import { returnSupplierQueryOptions } from '../../../../utils/proveedores/suppliersQueryOptions'
import { returnSupplierSearchSchema } from '../../../../schemas/proveedores/returnSupplierSearchSchema'
import { queryClient } from '../../../../App'
import SupplierReturnsPage  from '../../../../pages/proveedores/returnSuppliers/ReturnManagementPage'

export const Route = createFileRoute('/_auth/proveedores/devoluciones/')({
  validateSearch: zodValidator(returnSupplierSearchSchema),
  loaderDeps: ({ search }) => search,
  loader: ({deps}) => queryClient.prefetchQuery(returnSupplierQueryOptions(deps)),
  component: SupplierReturnsPage
})
