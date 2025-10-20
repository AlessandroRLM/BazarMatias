import { createFileRoute } from '@tanstack/react-router'
import BulkUploadProducts from '../../../../pages/inventario/inventory/BulkUploadProduct'

export const Route = createFileRoute('/_auth/inventario/productos/carga-masiva-productos')({
  component: BulkUploadProducts
})
