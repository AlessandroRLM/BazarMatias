import { createFileRoute } from '@tanstack/react-router'
import BulkUploadSupplies from '../../../../pages/insumos/BulkUploadSupplies'

export const Route = createFileRoute('/_auth/inventario/insumos/carga-masiva-insumos')({
  component: BulkUploadPage
})

function BulkUploadPage() {
  return <BulkUploadSupplies />
}