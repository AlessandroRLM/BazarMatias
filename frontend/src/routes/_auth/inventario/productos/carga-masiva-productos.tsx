import { createFileRoute } from '@tanstack/react-router'
import BulkUploadProducts from '../../../../pages/inventario/BulkUploadProduct'

export const Route = createFileRoute('/_auth/inventario/productos/carga-masiva-productos')({
  component: BulkUploadPage
})

function BulkUploadPage() {
  return <BulkUploadProducts />
}