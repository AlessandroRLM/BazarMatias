import { PaginationState } from "@tanstack/react-table"
import { DEFAULT_PAGE_SIZE } from "../../components/core/CustomTable/CustomTable"

// Adaptador para transformar entre la paginación de la API y TanStack Table
export const tablePaginationAdapter = {
    // Transforma los parámetros de la API a los que espera TanStack Table
    apiToTable: (apiPagination: { current_page: number, page_size?: number }) => {
        return {
            pageIndex: apiPagination.current_page - 1, // Convertir de base 1 a base 0
            pageSize: apiPagination.page_size ?? DEFAULT_PAGE_SIZE
        }
    },

    // Transforma los parámetros de TanStack Table a los que espera la API
    tableToApi: (tablePagination: PaginationState) => {
        return {
            page: tablePagination.pageIndex + 1, // Convertir de base 0 a base 1
            page_size: tablePagination.pageSize
        }
    }
}