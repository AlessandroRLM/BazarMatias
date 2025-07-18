import { AxiosResponse } from "axios";
import AxiosInstance from "../helpers/AxiosInstance";
import { CustomPagination } from "../types/core.types";
import { Product } from "../types/inventory.types";
import { BuyOrder, Supplier, BuyOrdersParams } from "../types/proveedores.types";
import { BuyOrderCreationFormValues } from "../schemas/proveedores/buyOrderSchema";

//para formulario de ordenes de compra y ventas
export const fetchProducts = async (search: String) => {
    if (!search){
        const response: AxiosResponse<CustomPagination<Product>> = await AxiosInstance.get(`/api/inventory/products/?page_size=20`);
        return response.data;
    }
    // Aseguramos que la búsqueda se realice correctamente en el backend
    const response: AxiosResponse<CustomPagination<Product>> = await AxiosInstance.get(`/api/inventory/products/?page_size=20&${search}`);
    return response.data;
};

export const fetchSuppliers = async () => {
    
    const response: AxiosResponse<CustomPagination<Supplier>> = await AxiosInstance.get(`/api/suppliers/suppliers/?page_size=20`);
    return response.data;
};

export const fetchBuyOrderById = async (orderId: string) => {
    const response: AxiosResponse<BuyOrder> = await AxiosInstance.get(`/api/suppliers/buy_orders/${orderId}/`);
    return response.data;
  };

export const createBuyOrder = async (data: BuyOrderCreationFormValues) => {
    try {
        const response = await AxiosInstance.post('/api/suppliers/buy_orders/', data)
        return response
    } catch (error) {
        throw error
      }
}

export const editBuyOrder = async (id: string, data: BuyOrderCreationFormValues) => {
    try {
        const response = await AxiosInstance.put(`/api/suppliers/buy_orders/${id}/`, data)
        return response
    } catch (error) {
        throw error
      }
}

export const deleteBuyOrder = async (orderId: string) => {
    const response = await AxiosInstance.delete(`/api/suppliers/buy_orders/${orderId}/`);
    return response.data;
};

export const fetchBuyOrders = async (params: BuyOrdersParams = {}) => {
  const url = '/api/suppliers/buy_orders/';
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.page_size) queryParams.append('page_size', params.page_size.toString());
  if (params.status) queryParams.append('status', params.status);
  if (params.search) queryParams.append('search', params.search);
  if (params.ordering) queryParams.append('ordering', params.ordering);
  
  const response: AxiosResponse<CustomPagination<BuyOrder>> = await AxiosInstance.get(
    `${url}?${queryParams.toString()}`
  );
  return response.data;
};