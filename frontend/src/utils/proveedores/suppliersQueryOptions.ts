import { queryOptions } from "@tanstack/react-query"
import { AxiosResponse } from "axios"
import AxiosInstance from "../../helpers/AxiosInstance"
import { BuyOrderSearchType } from "../../schemas/proveedores/buyOrderSearchSchema"
import { CustomPagination } from "../../types/core.types"
import { BuyOrder, ReturnSupplierList } from "../../types/proveedores.types"
import { ReturnSupplierSearchType } from "../../schemas/proveedores/returnSupplierSearchSchema"

export const buyOrderQueryOptions = (opts: BuyOrderSearchType) => {
    return queryOptions({
        queryKey: ['buyOrder', opts],
        queryFn: async () => {
            const response: AxiosResponse<CustomPagination<BuyOrder>> = await AxiosInstance.get('/api/suppliers/buy_orders', {
            params: opts,
            })
            return response ?? {}
        } 
    })
}

export const returnSupplierQueryOptions = (opts: ReturnSupplierSearchType) => {
    return queryOptions({
        queryKey: ['returnSupplier', opts],
        queryFn: async () => {
            const response: AxiosResponse<CustomPagination<ReturnSupplierList>> = await AxiosInstance.get('/api/suppliers/return_suppliers', {
            params: opts,
            })
            return response ?? {}
        } 
    })
}