import AxiosInstance from '../helpers/AxiosInstance';

// CRUD de Proveedores con paginación, búsqueda y filtros
export const fetchSuppliers = async ({
  page = 1,
  page_size = 10,
  search = '',
  category = '',
  ordering = '',
}: {
  page?: number;
  page_size?: number;
  search?: string;
  category?: string;
  ordering?: string;
} = {}) => {
  let url = `/api/inventory/suppliers/?page=${page}&page_size=${page_size}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  if (category) url += `&category=${encodeURIComponent(category)}`;
  if (ordering) url += `&ordering=${encodeURIComponent(ordering)}`;
  const response = await AxiosInstance.get(url);
  return response.data;
};

export const fetchSupplier = async (id: string) => {
  const response = await AxiosInstance.get(`/api/inventory/suppliers/${id}/`);
  return response.data;
};

export const createSupplier = async (supplier: any) => {
  const response = await AxiosInstance.post('/api/inventory/suppliers/', supplier);
  return response.data;
};

export const updateSupplier = async (id: string, supplier: any) => {
  const response = await AxiosInstance.put(`/api/inventory/suppliers/${id}/`, supplier);
  return response.data;
};

export const deleteSupplier = async (id: string) => {
  await AxiosInstance.delete(`/api/inventory/suppliers/${id}/`);
};

// CRUD de Productos con paginación, búsqueda y filtros
export const fetchProducts = async ({
  page = 1,
  page_size = 10,
  search = '',
  category = '',
  supplier = '',
  ordering = '',
}: {
  page?: number;
  page_size?: number;
  search?: string;
  category?: string;
  supplier?: string;
  ordering?: string;
} = {}) => {
  let url = `/api/inventory/products/?page=${page}&page_size=${page_size}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  if (category) url += `&category=${encodeURIComponent(category)}`;
  if (supplier) url += `&supplier__id=${encodeURIComponent(supplier)}`;
  if (ordering) url += `&ordering=${encodeURIComponent(ordering)}`;
  const response = await AxiosInstance.get(url);
  return response.data;
};

export const fetchProduct = async (id: string) => {
  const response = await AxiosInstance.get(`/api/inventory/products/${id}/`);
  return response.data;
};

export const createProduct = async (product: any) => {
  const response = await AxiosInstance.post('/api/inventory/products/', product);
  return response.data;
};

export const updateProduct = async (id: string, product: any) => {
  const response = await AxiosInstance.put(`/api/inventory/products/${id}/`, product);
  return response.data;
};

export const deleteProduct = async (id: string) => {
  await AxiosInstance.delete(`/api/inventory/products/${id}/`);
};