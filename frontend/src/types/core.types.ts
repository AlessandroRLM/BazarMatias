export interface PaginationParams {
    page: number
    page_size: number
} 

export type SortParams = { sortBy: `${"-" | ""}${string}` }

export type Filters<T> = Partial<T & PaginationParams & SortParams>

export interface InfoPagination {
    count: number
    pages: number
    current_page: number
    next: number | null
    previous: number | null
}

export interface CustomPagination<T> {
    info: InfoPagination
    results: T[]
}
