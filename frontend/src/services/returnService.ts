import AxiosInstance from "../helpers/AxiosInstance";

export interface Client {
  id: string;
  first_name: string;
  last_name: string;
  national_id: string;
}

export interface Product {
  id: string;
  name: string;
  sku?: string;
}

export interface Sale {
  id: string;
  folio: number;
  created_at: string;
}

export interface Return {
  id: string;
  client: Client;
  sale: Sale;
  product: Product;
  quantity: number;
  reason: string;
  created_at: string;
  status: 'pending' | 'completed';
}

export const fetchReturns = async (
  page: number = 1,
  pageSize: number = 10,
  filters: any = {}
) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
      ...filters
    });

    const response = await AxiosInstance.get(`/api/sales/returns/?${params}`);
    
    // Transforma los datos para asegurar la estructura correcta
    const results = response.data.results.map((item: any) => ({
      ...item,
      client: item.client || { first_name: 'Desconocido', last_name: '', national_id: '' },
      product: item.product || { name: 'Producto no disponible', sku: '' },
      sale: item.sale || { folio: 0, created_at: new Date().toISOString() }
    }));

    return {
      results,
      info: {
        count: response.data.count || 0
      }
    };
  } catch (error) {
    console.error("Error fetching returns:", error);
    throw error;
  }
};

// [Resto de funciones...]

export const fetchReturnDetails = async (id: string): Promise<Return> => {
  try {
    const response = await AxiosInstance.get<Return>(`/api/sales/returns/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching return details:", error);
    throw error;
  }
};

export const createReturn = async (data: {
  client: string;
  sale: string;
  product: string;
  quantity: number;
  reason: string;
}): Promise<Return> => {
  try {
    const response = await AxiosInstance.post<Return>('/api/sales/returns/', data);
    return response.data;
  } catch (error) {
    console.error("Error creating return:", error);
    throw error;
  }
};

export const updateReturn = async (
  id: string,
  data: {
    quantity?: number;
    reason?: string;
    status?: 'pending' | 'completed';
  }
): Promise<Return> => {
  try {
    const response = await AxiosInstance.patch<Return>(`/api/sales/returns/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating return:", error);
    throw error;
  }
};

export const deleteReturn = async (id: string): Promise<void> => {
  try {
    await AxiosInstance.delete(`/api/sales/returns/${id}/`);
  } catch (error) {
    console.error("Error deleting return:", error);
    throw error;
  }
};

export const fetchClientsForSelect = async (search: string = ''): Promise<Client[]> => {
  try {
    const response = await AxiosInstance.get<PaginatedResponse<Client>>(
      `/api/sales/clients/?page_size=20${search ? `&search=${search}` : ''}`
    );
    return response.data.results;
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw error;
  }
};

export const fetchClientSales = async (clientId: string): Promise<Sale[]> => {
  try {
    const response = await AxiosInstance.get<PaginatedResponse<Sale>>(
      `/api/sales/sales/?client=${clientId}`
    );
    return response.data.results;
  } catch (error) {
    console.error("Error fetching client sales:", error);
    throw error;
  }
};

export const fetchSaleDetails = async (saleId: string): Promise<Sale> => {
  try {
    const response = await AxiosInstance.get<Sale>(`/api/sales/sales/${saleId}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching sale details:", error);
    throw error;
  }
};