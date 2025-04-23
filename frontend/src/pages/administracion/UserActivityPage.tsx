import { useSuspenseQuery } from "@tanstack/react-query"
import { userActivityQueryOptions, usersSelectQueryOptions } from "../../utils/administracion/administracionQueryOptions"
import { useLoaderDeps } from "@tanstack/react-router"
import PageHeader from "../../components/core/PageHeader/PageHeader"
import { Button } from "@mui/joy"
import CustomTable from "../../components/core/CustomTable/CustomTable"
import { sortByToState, stateToSortBy } from "../../utils/core/tableSortMapper"
import useFilters from "../../hooks/core/useFilters"
import { tablePaginationAdapter } from "../../utils/core/tablePaginationAdapter"
import FilterOptions from "../../components/core/FilterOptions/FilterOptions"
import { USER_ACTIVITY_COLUMNS } from "../../utils/administracion/usersActivityColumns"
import { useMemo } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { UserActivity } from "../../types/administracion.types"


const UserActivityPage = () => {
    const { filters, setFilters } = useFilters('/_auth/administracion/usuarios/actividad-de-usuarios')
    const loaderDeps = useLoaderDeps({ from: '/_auth/administracion/usuarios/actividad-de-usuarios' })
    const usersActivityQuery = useSuspenseQuery(userActivityQueryOptions(loaderDeps))
    const usersActivityResponse = usersActivityQuery?.data
    const usersSelectsQuery = useSuspenseQuery(usersSelectQueryOptions())
    const usersSelectsResponse = usersSelectsQuery?.data
    const sortingState = sortByToState(filters?.ordering)
    const paginationState = tablePaginationAdapter.apiToTable({
        current_page: usersActivityResponse?.data?.info.current_page ?? 1,
        page_size: loaderDeps?.page_size
      })

    const columns = useMemo(() => USER_ACTIVITY_COLUMNS as ColumnDef<UserActivity>[], [])

    return (
        <>
            <PageHeader
                title="Actividad de Usuarios"
                buttons={[
                    <Button variant="solid" color="primary" size="lg" sx={{ borderRadius: 'var(--joy-radius-md)' }}>
                        Exportar
                    </Button>,
                    <Button variant="solid" color="primary" size="lg" sx={{ borderRadius: 'var(--joy-radius-md)' }}>
                        Importar
                    </Button>
                ]}
            />
            <FilterOptions
                filters={filters}
                onChangeFilters={(filters) => setFilters(filters)}
                selects={[
                    {id: 'user', placeholder: 'Usuario', options: usersSelectsResponse?.data.results.map((user) => ({value: user.id, label: `${user.first_name} ${user.last_name}`})) ?? []},
                    {id: 'data__status_type', placeholder: 'Tipo de Estado', options: [{value: 'success', label: 'Exito'}, {value: 'error', label: 'Error'}]}
                ]}
            />
            <CustomTable
                data={usersActivityResponse?.data?.results ?? []}
                columns={columns}
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
                    rowCount: usersActivityResponse?.data?.info.count ?? 0
                }}
                sorting={sortingState}
                onSortingChange={(sorting) => {
                    const newSortingState = typeof sorting === 'function'
                    ? sorting(sortingState)
                    : sortingState
                        return setFilters({ordering: stateToSortBy(newSortingState)})
                    }
                }
            />
            <pre>{JSON.stringify(filters)}</pre>
        </>
    )


}

export default UserActivityPage