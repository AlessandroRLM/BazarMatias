import { createFileRoute } from '@tanstack/react-router'
import ProductCreation from '../../../../pages/inventario/ProductCreation'

export const Route = createFileRoute('/_auth/inventario/productos/crear-producto')({
  component: ProductCreationPage
})

function ProductCreationPage() {
  return <ProductCreation />
}