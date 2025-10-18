import { useLoaderDeps, useNavigate } from "@tanstack/react-router"
import useFilters from "../../../hooks/core/useFilters"
import { useMutation, useSuspenseQuery } from "@tanstack/react-query"
import { returnSupplierQueryOptions } from "../../../utils/proveedores/suppliersQueryOptions"
import PageHeader from "../../../components/core/PageHeader/PageHeader"
import FilterOptions from "../../../components/core/FilterOptions/FilterOptions"
import CustomTable from "../../../components/core/CustomTable/CustomTable"
import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { tablePaginationAdapter } from "../../../utils/core/tablePaginationAdapter"
import { sortByToState, stateToSortBy } from "../../../utils/core/tableSortMapper"
import { queryClient } from "../../../App"
import { deleteReturnSupplier } from "../../../services/supplierService"
import ConfirmDialog from "../../../components/administracion/ConfirmDialog/ConfirmDialog"
import { RETURN_SUPPLIER_COLUMNS } from "../../../utils/proveedores/returnSupplierColumns"
import { ReturnSupplierList } from "../../../types/suppliers.types"

const ReturnSupplierManagementPage = () => {
    const navigate = useNavigate()
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [returnToDelete, setReturnToDelete] = useState<string | null>(null)
    const { filters, setFilters } = useFilters('/_auth/proveedores/devoluciones/')
    const loaderDeps = useLoaderDeps({ from: '/_auth/proveedores/devoluciones/' })
    const returnSupplierQuery = useSuspenseQuery(returnSupplierQueryOptions(loaderDeps))
    const returnSupplierResponse = returnSupplierQuery?.data
    const sortingState = sortByToState(filters?.ordering)
    const paginationState = tablePaginationAdapter.apiToTable({
        current_page: returnSupplierResponse?.data?.info.current_page ?? 1,
        page_size: loaderDeps?.page_size
    })

    const deleteMutation = useMutation({
        mutationFn: deleteReturnSupplier,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['returnSuppliers'] });
            setDeleteModalOpen(false);
            setReturnToDelete(null);
        }
    });

    const handleOpenDeleteModal = (id: string) => {
        setReturnToDelete(id);
        setDeleteModalOpen(true);
    };

    const handleDelete = () => {
        if (returnToDelete) {
            deleteMutation.mutate(returnToDelete);
        }
    };

    return (
        <>
            <ConfirmDialog
                open={deleteModalOpen}
                title="Eliminar Devolución"
                content={`¿Estás seguro de que deseas eliminar la devolución: "${returnToDelete}"?`}
                onConfirm={handleDelete}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setReturnToDelete(null);
                }}
            />
            <PageHeader
                title="Devoluciones a Proveedores"
                buttons={[
                    { 
                        onClick: () => navigate({ to: '/proveedores/devoluciones/crear-devolucion' }), 
                        text: 'Crear Devolución' 
                    }
                ]}
            />
            <FilterOptions
                onChangeFilters={(filters) => setFilters(filters)}
                selects={[
                    {
                        id: 'status', 
                        placeholder: 'Estado', 
                        options: [
                            { value: null, label: 'Todos' },
                            { value: 'PE', label: 'Pendiente' },
                            { value: 'AP', label: 'Aprobado' },
                            { value: 'RE', label: 'Rechazado' }
                        ]
                    },
                    {
                        id: 'supplier',
                        placeholder: 'Proveedor',
                        options: [
                            { value: null, label: 'Todos los proveedores' }
                            // Aquí deberías cargar dinámicamente los proveedores desde tu API
                        ]
                    }
                ]}
                dateRangePicker={true}
                dateRangePickerValue={{ start: new Date(), end: new Date() }}
            />
            <CustomTable
                data={returnSupplierResponse?.data?.results ?? []}
                columns={RETURN_SUPPLIER_COLUMNS(handleOpenDeleteModal) as ColumnDef<ReturnSupplierList>[]}
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
                    rowCount: returnSupplierResponse?.data?.info.count ?? 0
                }}
                sorting={sortingState}
                onSortingChange={(sorting) => {
                    const newSortingState = typeof sorting === 'function'
                        ? sorting(sortingState)
                        : sortingState
                    return setFilters({ ordering: stateToSortBy(newSortingState) })
                }}
            />
        </>
    )
}

export default ReturnSupplierManagementPage