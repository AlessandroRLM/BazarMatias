import { RouteIds, RegisteredRouter, getRouteApi, useNavigate, SearchParamOptions } from "@tanstack/react-router";
import { cleanEmptyParams } from "../../utils/core/cleanEmptyParams";

export default function useFilters<
        TId extends RouteIds<RegisteredRouter['routeTree']>,
        TsearchParams extends SearchParamOptions<
            RegisteredRouter,
            TId,
            TId
        >["search"],
    >(routeId: TId) {
    const routeApi = getRouteApi<TId>(routeId)
    const navigate = useNavigate()
    const filters = routeApi.useSearch()

    const setFilters = (partialFilters: Partial<TsearchParams>) => {
        console.log('setFilters', {filters, partialFilters})
        navigate({
            search: cleanEmptyParams({ ...filters, ...partialFilters, }) as TsearchParams,
        })}
    const resetFilters = () => navigate({ search: {} as TsearchParams })

    return { filters, setFilters, resetFilters }
}