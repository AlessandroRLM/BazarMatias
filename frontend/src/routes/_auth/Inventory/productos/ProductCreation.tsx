import { createFileRoute } from '@tanstack/react-router'
import ProductCreation from '../../../../pages/Inventory/ProductCreation'

export const Route = createFileRoute('/_auth/Inventory/productos/ProductCreation')({
  component: ProductCreationPage
})

function ProductCreationPage() {
  return <ProductCreation />
}