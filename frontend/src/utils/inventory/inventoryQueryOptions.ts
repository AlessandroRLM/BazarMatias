import { queryOptions } from "@tanstack/react-query"
import AxiosInstance from "../../helpers/AxiosInstance";

export const inventoryMetricsQueryOptions = () =>
  queryOptions({
    queryKey: ['inventory', 'metrics'],
    queryFn: async () => {
      const response = await AxiosInstance.get('/api/inventory/metrics/')
      return response.data
    }
  })
