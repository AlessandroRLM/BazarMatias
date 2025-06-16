import { createFileRoute } from '@tanstack/react-router'
import InventoryManagementPage from '../../../../pages/inventario/InventoryManagementPage'
import { zodValidator } from '@tanstack/zod-adapter'
import { productsSearchSchema } from '../../../../schemas/inventario/productsSearchSchema'
import { queryClient } from '../../../../App'
import { productsQueryOptions } from '../../../../utils/inventory/inventoryQueryOptions'

export const Route = createFileRoute('/_auth/inventario/productos/')({
  validateSearch: zodValidator(productsSearchSchema),
  loaderDeps: ({ search }) => search,
  loader: ({deps}) => queryClient.prefetchQuery(productsQueryOptions(deps)),
  component: ProductsRouteComponent
})

function ProductsRouteComponent() {
  return <InventoryManagementPage />
}