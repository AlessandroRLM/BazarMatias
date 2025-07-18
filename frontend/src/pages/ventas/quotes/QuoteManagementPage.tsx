import { useLoaderDeps, useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import useFilters from "../../../hooks/core/useFilters"
import { useMutation, useQueries, useSuspenseQuery } from "@tanstack/react-query"
import { quotesQueryOptions } from "../../../utils/ventas/salesQueryOptions"
import { tablePaginationAdapter } from "../../../utils/core/tablePaginationAdapter"
import { sortByToState, stateToSortBy } from "../../../utils/core/tableSortMapper"
import { queryClient } from "../../../App"
import { deleteQuote } from "../../../services/saleService"
import ConfirmDialog from "../../../components/administracion/ConfirmDialog/ConfirmDialog"
import PageHeader from "../../../components/core/PageHeader/PageHeader"
import FilterOptions from "../../../components/core/FilterOptions/FilterOptions"
import CustomTable from "../../../components/core/CustomTable/CustomTable"
import { QUOTE_COLUMNS } from "../../../utils/ventas/quoteColumns"
import { ColumnDef } from "@tanstack/react-table"
import { Client, Quote } from "../../../types/sales.types"
import AxiosInstance from "../../../helpers/AxiosInstance"
import { AxiosResponse } from "axios"


const QuoteManagementPage = () => {
    const navigate = useNavigate()
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)
    const [quoteToDelete, setQuoteToDelete] = useState<string | null>(null)
    const { filters, setFilters } = useFilters('/_auth/ventas/cotizaciones/')
    const loaderDeps = useLoaderDeps({ from: '/_auth/ventas/cotizaciones/' })
    const quoteQuery = useSuspenseQuery(quotesQueryOptions(loaderDeps))
    const quoteResponse = quoteQuery?.data
    const sortingState = sortByToState(filters?.ordering)
    const paginationState = tablePaginationAdapter.apiToTable({
        current_page: quoteResponse?.data?.info.current_page ?? 1,
        page_size: loaderDeps?.page_size
    })

    const clientsQueries = useQueries({
        queries: quoteResponse?.data?.results.map((quote, index) => ({
            queryKey: ['quoteClient', quote.client, index],
            queryFn: async () => {
                const response: AxiosResponse<Client> = await AxiosInstance.get(`/api/sales/clients/${quote.client}`)
                return response
            },
        }))
    })

    const quotesWithClientNames = quoteResponse?.data?.results.map((quote, index) => {
        const clientData = clientsQueries[index]?.data?.data;
        return {
            ...quote,
            client: clientData ? `${clientData.first_name} ${clientData.last_name}` : quote.client
        };
    });
    const deleteMutation = useMutation({
        mutationFn: deleteQuote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['quotes'] })
            setDeleteModalOpen(false)
        }
    })

    const handleOpenDeleteModal = (id: string) => {
        setQuoteToDelete(id)
        setDeleteModalOpen(true)
    }

    const handleDelete = () => {
        if (quoteToDelete) {
            deleteMutation.mutate(quoteToDelete)
        }
    }

    return (
        <>
            <ConfirmDialog
                open={deleteModalOpen}
                title="Eliminar Cotización"
                content={'¿Estás seguro de eliminar esta cotización?'}
                onConfirm={handleDelete}
                onClose={() => setDeleteModalOpen(false)}
            />

            <PageHeader
                title="Cotizaciones"
                buttons={[
                    { onClick: () => navigate({ to: '/ventas/cotizaciones/crear-cotizacion' }), text: 'Crear Cotización' }
                ]}
            />

            <FilterOptions
                onChangeFilters={(filters) => setFilters(filters)}
                selects={[
                    {
                        id: 'status', placeholder: 'Estado', options: [
                            { value: null, label: 'Estado' },
                            { value: 'RE', label: 'Rechazado' },
                            { value: 'PE', label: 'Pendiente' },
                            { value: 'AP', label: 'Aprobado' }]
                    },
                ]}
                datePicker={true}
            />

            <CustomTable
                data={quotesWithClientNames ?? []}
                columns={QUOTE_COLUMNS(handleOpenDeleteModal) as ColumnDef<Quote>[]}
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
                    rowCount: quoteResponse?.data?.info.count ?? 0
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

export default QuoteManagementPage