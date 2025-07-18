import { useSuspenseQuery } from "@tanstack/react-query"
import { useLoaderDeps } from "@tanstack/react-router"
import useFilters from "../../hooks/core/useFilters"
import { userActivityQueryOptions, usersSelectQueryOptions } from "../../utils/administracion/administracionQueryOptions"
import { tablePaginationAdapter } from "../../utils/core/tablePaginationAdapter"
import { sortByToState } from "../../utils/core/tableSortMapper"

const ClientsReturnsPage = () => {
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

}