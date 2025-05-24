import { AxiosResponse } from "axios";
import AxiosInstance from "../helpers/AxiosInstance";
import { CustomPagination } from "../types/core.types";
import { Product } from "../types/inventory.types";
import { BuyOrder, Supplier } from "../types/proveedores.types";
import { BuyOrderCreationFormValues } from "../schemas/proveedores/buyOrderSchema";

//para formulario de ordenes de compra
export const fetchProducts = async (search: String) => {
    if (!search){
        const response: AxiosResponse<CustomPagination<Product>> = await AxiosInstance.get(`/api/inventory/products/?page_size=20`);
        return response.data;
    }
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