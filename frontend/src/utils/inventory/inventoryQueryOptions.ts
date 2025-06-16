import { queryOptions } from "@tanstack/react-query"
import AxiosInstance from "../../helpers/AxiosInstance";
import { ProductsSearchType } from "../../schemas/inventario/productsSearchSchema";
import { AxiosResponse } from "axios";
import { CustomPagination } from "../../types/core.types";
import { Product } from "../../types/inventory.types";

export const productsQueryOptions = (opts: ProductsSearchType) =>
  queryOptions({
    queryKey: ['products', opts],
    queryFn: async () => {
      const response: AxiosResponse<CustomPagination<Product>> = await AxiosInstance.get('/api/inventory/products/', {
        params: opts,
      })
      return response ?? {}
    }
  })

export const inventoryMetricsQueryOptions = () =>
  queryOptions({
    queryKey: ['inventory', 'metrics'],
    queryFn: async () => {
      const response = await AxiosInstance.get('/api/inventory/metrics/')
      return response.data
    }
  })
