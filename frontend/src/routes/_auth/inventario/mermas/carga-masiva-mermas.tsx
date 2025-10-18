import { createFileRoute } from '@tanstack/react-router'
import BulkUploadShrinkage from '../../../../pages/inventario/shrinkages/BulkUploadShrinkage'

export const Route = createFileRoute('/_auth/inventario/mermas/carga-masiva-mermas')({
  component: BulkUploadPage
})

function BulkUploadPage() {
  return <BulkUploadShrinkage />
}