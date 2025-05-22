import { createFileRoute } from '@tanstack/react-router'
import BulkUploadShrinkage from '../../../../pages/mermas/BulkUploadShrinkage'

export const Route = createFileRoute('/_auth/inventario/insumos/carga-masiva-insumos')({
  component: BulkUploadPage
})

function BulkUploadPage() {
  return <BulkUploadShrinkage />
}