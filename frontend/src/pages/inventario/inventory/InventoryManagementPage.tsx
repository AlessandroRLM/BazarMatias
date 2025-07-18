import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Button, Stack, Typography, Box } from "@mui/joy"
import CustomTable from "../../../components/core/CustomTable/CustomTable"
import Header from "../../../components/core/layout/components/Header"
import FilterOptions, { SelectConfig } from "../../../components/core/FilterOptions/FilterOptions"
import { useLoaderDeps } from '@tanstack/react-router'
import { Link } from "@tanstack/react-router"
import { deleteProduct } from "../../../services/inventoryService"
import ConfirmDialog from "../../../components/administracion/ConfirmDialog/ConfirmDialog"
import useFilters from "../../../hooks/core/useFilters"
import { useMutation, useSuspenseQuery } from "@tanstack/react-query"
import { tablePaginationAdapter } from "../../../utils/core/tablePaginationAdapter"
import { sortByToState, stateToSortBy } from "../../../utils/core/tableSortMapper"
import { queryClient } from "../../../App"
import { productsQueryOptions } from "../../../utils/inventario/inventoryQueryOptions"
import { Product } from "../../../types/inventory.types"
import { INVENTORY_COLUMNS } from "../../../utils/inventario/inventoryColumns"


interface ProductToDelete {
  id: string
  name: string
}

export default function InventoryManagementPage() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<ProductToDelete | null>(null)
  const { filters, setFilters } = useFilters('/_auth/inventario/productos/')
  const loaderDeps = useLoaderDeps({ from: '/_auth/inventario/productos/' })
  const productsQuery = useSuspenseQuery(productsQueryOptions(loaderDeps))
  const productsResponse = productsQuery?.data
  const sortingState = sortByToState(filters?.ordering)
  const paginationState = tablePaginationAdapter.apiToTable({
    current_page: productsResponse?.data?.info.current_page ?? 1,
    page_size: loaderDeps?.page_size
  })

  // Configuración de los selects de filtro
  const selectConfigs: SelectConfig[] = [
    {
      id: "category",
      placeholder: "Categoría",
      options: [
        { value: "", label: "Todas" },
        { value: "Electrónicos", label: "Electrónicos" },
        { value: "Accesorios", label: "Accesorios" },
        { value: "Ropa", label: "Ropa" },
        { value: "Oficina", label: "Oficina" },
        { value: "utiles", label: "utiles" },
        { value: "otros", label: "otros" },
      ],
    },
    {
      id: "status_stock",
      placeholder: "Stock",
      options: [
        { value: '', label: "Todos" },
        { value: 'normal', label: "Stock Normal" },
        { value: 'low', label: "Bajo Stock" },
        { value: 'out', label: "Sin Stock" },
      ],
    },
  ]

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      setDeleteDialogOpen(false)
    }
  })

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      deleteMutation.mutate(productToDelete.id)
    }
  }

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false)
    setProductToDelete(null)
  }

  const handleOpenDeleteModal = (id: string, name: string) => {
    setProductToDelete({id, name})
    setDeleteDialogOpen(true)
  }

  return (
    <>
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Eliminar Producto"
        content={`¿Estás seguro de que deseas eliminar el producto "${productToDelete?.name}"?`}
        onConfirm={handleConfirmDelete}
        onClose={handleCancelDelete}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Box component="main" sx={{
          flex: 1,
          p: 3,
          pt: { xs: 'calc(var(--Header-height) + 16px)', md: 3 },
          maxWidth: '1600px',
          mx: 'auto',
          width: '100%'
        }}>
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography level="h2">Gestión de Productos</Typography>
              <Stack direction="row" justifyContent="flex-end" spacing={2}>
                <Button
                  component={Link}
                  to="/inventario/productos/carga-masiva-productos"
                  variant="solid"
                  color="primary"
                >
                  Carga masiva
                </Button>
                <Button
                  component={Link}
                  to="/inventario/productos/crear-producto"
                  variant="solid"
                  color="primary"
                >
                  Añadir Producto
                </Button>
              </Stack>
            </Stack>
            <FilterOptions
              onChangeFilters={(filters) => setFilters(filters)}
              selects={selectConfigs}
            />
            <CustomTable
              data={productsResponse?.data?.results ?? []}
              columns={INVENTORY_COLUMNS(handleOpenDeleteModal) as ColumnDef<Product>[]}
              pagination={paginationState}
              paginationOptions={{
                onPaginationChange: (pagination) => {
                  const newPaginationState = typeof pagination === 'function'
                    ? pagination(paginationState)
                    : pagination

                  const mappedPagination = tablePaginationAdapter.tableToApi(newPaginationState)

                  setFilters({
                    ...mappedPagination
                  })
                },
                rowCount: productsResponse?.data?.info.count ?? 0
              }}
              sorting={sortingState}
              onSortingChange={(sorting) => {
                const newSortingState = typeof sorting === 'function'
                  ? sorting(sortingState)
                  : sortingState
                return setFilters({ ordering: stateToSortBy(newSortingState) })
              }}
            />
          </Stack>
        </Box>
      </Box>
    </>
  )
}