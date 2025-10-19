import { createFileRoute } from '@tanstack/react-router'
import SuppliersManagementPage  from '../../../pages/proveedores/supplier/SuppliersManagementPage'
import { zodValidator } from '@tanstack/zod-adapter'
import { supplierSearchSchema } from '../../../schemas/proveedores/supplierSearchSchema'
import { queryClient } from '../../../App'
import { suppliersQueryOptions } from '../../../utils/proveedores/suppliersQueryOptions'

export const Route = createFileRoute('/_auth/proveedores/')({
  validateSearch: zodValidator(supplierSearchSchema),
  loaderDeps: ({search}) => search,
  loader: ({deps}) => queryClient.prefetchQuery(suppliersQueryOptions(deps)),
  component: SuppliersManagementPage
})
