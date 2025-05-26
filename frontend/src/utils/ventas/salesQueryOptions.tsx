import { queryOptions } from "@tanstack/react-query"
import { AxiosResponse } from "axios"
import { CustomPagination } from "../../types/core.types"
import AxiosInstance from "../../helpers/AxiosInstance"

import { Quote } from "../../types/sales.types"
import { QuoteSearchType } from "../../schemas/ventas/cotizaciones/quoteSearchSchema"

export const quotesQueryOptions = (opts: QuoteSearchType) => {
    return queryOptions({
        queryKey: ['quotes', opts],
        queryFn: async () => {
            const response: AxiosResponse<CustomPagination<Quote>> = await AxiosInstance.get('/api/sales/quotes', {
                params: opts,
            })
            return response ?? {}
        }
    })
}