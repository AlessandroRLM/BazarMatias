import { createFileRoute } from '@tanstack/react-router'
import BulkUploadSupplies from '../../../../pages/insumos/BulkUploadSupplies'

export const Route = createFileRoute('/_auth/inventario/mermas/carga-masiva-mermas')({
  component: BulkUploadPage
})

function BulkUploadPage() {
  return <BulkUploadSupplies />
}