import { useLoaderDeps, useNavigate } from "@tanstack/react-router"
import useFilters from "../../hooks/core/useFilters"
import { useMutation, useSuspenseQuery } from "@tanstack/react-query"
import { buyOrderQueryOptions } from "../../utils/proveedores/suppliersQueryOptions"
import PageHeader from "../../components/core/PageHeader/PageHeader"
import FilterOptions from "../../components/core/FilterOptions/FilterOptions"
import CustomTable from "../../components/core/CustomTable/CustomTable"
import { useState } from "react"
import { BUY_ORDER_COLUMNS } from "../../utils/proveedores/buyOrderColumns"
import { ColumnDef } from "@tanstack/react-table"
import { BuyOrder } from "../../types/proveedores.types"
import { tablePaginationAdapter } from "../../utils/core/tablePaginationAdapter"
import { sortByToState, stateToSortBy } from "../../utils/core/tableSortMapper"
import { queryClient } from "../../App"
import { deleteBuyOrder } from "../../services/supplierService"
import ConfirmDialog from "../../components/administracion/ConfirmDialog/ConfirmDialog"

const BuyOrderManagementPage = () => {
    const navigate = useNavigate()
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [orderToDelete, setOrderToDelete] = useState<string | null>(null)
    const { filters, setFilters } = useFilters('/_auth/proveedores/ordenes-de-compra')
    const loaderDeps = useLoaderDeps({ from: '/_auth/proveedores/ordenes-de-compra' })
    const buyOrderQuery = useSuspenseQuery(buyOrderQueryOptions(loaderDeps))
    const buyOrderResponse = buyOrderQuery?.data
    const sortingState = sortByToState(filters?.ordering)
    const paginationState = tablePaginationAdapter.apiToTable({
        current_page: buyOrderResponse?.data?.info.current_page ?? 1,
        page_size: loaderDeps?.page_size
    })

    const deleteMutation = useMutation({
        mutationFn: deleteBuyOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['buyOrders'] });
            setDeleteModalOpen(false);
        }
    });

    const handleOpenDeleteModal = (id: string) => {
        setOrderToDelete(id);
        setDeleteModalOpen(true);
    };

    const handleDelete = () => {
        if (orderToDelete) {
            deleteMutation.mutate(orderToDelete);
        }
    };

    return (
        <>
            <ConfirmDialog
                open={deleteModalOpen}
                title="Eliminar Producto"
                content={`¿Estás seguro de que deseas eliminar el producto "${orderToDelete}"?`}
                onConfirm={handleDelete}
                onClose={() => setDeleteModalOpen(false)}
            />
            <PageHeader
                title="Ordenes de Compra"
                buttons={[
                    { onClick: () => navigate({ to: '/proveedores/crear-ordenes-de-compra' }), text: 'Crear Orden de Compra' }
                ]}
            />
            <FilterOptions
                onChangeFilters={(filters) => setFilters(filters)}
                selects={[
                    { id: 'status', placeholder: 'Estado', options: [{ value: null, label: 'Estado' }, { value: 'RE', label: 'Rechazado' }, { value: 'PE', label: 'Pendiente' }, { value: 'AP', label: 'Aprobado' }] }
                ]}
            />
            <CustomTable
                data={buyOrderResponse?.data?.results ?? []}
                columns={BUY_ORDER_COLUMNS(handleOpenDeleteModal) as ColumnDef<BuyOrder>[]}
                pagination={paginationState}
                paginationOptions={{
                    onPaginationChange: (pagination) => {
                        const newPaginationState = typeof pagination === 'function'
                            ? pagination(paginationState)
                            : pagination;

                        const mappedPagination = tablePaginationAdapter.tableToApi(newPaginationState)

                        setFilters({
                            ...mappedPagination
                        })
                    },
                    rowCount: buyOrderResponse?.data?.info.count ?? 0
                }}
                sorting={sortingState}
                onSortingChange={(sorting) => {
                    const newSortingState = typeof sorting === 'function'
                        ? sorting(sortingState)
                        : sortingState
                    return setFilters({ ordering: stateToSortBy(newSortingState) })
                }
                }
            />
        </>
    )
}

export default BuyOrderManagementPage

